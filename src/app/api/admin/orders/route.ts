import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

const ORDER_STATUSES = ["pending", "completed", "cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    if (search && search.length >= 2) {
      const searchRegex = new RegExp(search, "i");
      const orders = await Order.find({
        $or: [
          { customerName: searchRegex },
          { customerEmail: searchRegex },
          { orderNumber: searchRegex },
        ],
      })
        .sort({ createdAt: -1 })
        .lean()
        .limit(50);

      return NextResponse.json({ orders });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { customerName, customerEmail, items, status } = body;

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const statusValue: OrderStatus = ORDER_STATUSES.includes(status)
      ? status
      : "pending";

    const order = await Order.create({
      orderNumber,
      items: orderItems,
      totalAmount,
      customerName,
      customerEmail: customerEmail || undefined,
      status: statusValue,
    });

    if (statusValue === "completed") {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: {
            stock: -item.quantity,
            salesCount: item.quantity,
            revenue: item.price * item.quantity,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create order",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const nextStatus = body.status as OrderStatus;

    if (!ORDER_STATUSES.includes(nextStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const current = await Order.findById(id).lean();
    if (!current) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const prevStatus = current.status as OrderStatus;

    if (prevStatus === "completed" && nextStatus !== "completed") {
      for (const item of current.items || []) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: {
            stock: item.quantity,
            salesCount: -item.quantity,
            revenue: -(item.price || 0) * item.quantity,
          },
        });
      }
    }

    if (prevStatus !== "completed" && nextStatus === "completed") {
      for (const item of current.items || []) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: {
            stock: -item.quantity,
            salesCount: item.quantity,
            revenue: (item.price || 0) * item.quantity,
          },
        });
      }
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: nextStatus },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}





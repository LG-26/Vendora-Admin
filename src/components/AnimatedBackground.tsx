"use client";

export default function AnimatedBackground() {
  const ecommerceIcons = [
    { icon: "🛒", delay: 0, left: "10%", top: "20%" },
    { icon: "📦", delay: 2, left: "85%", top: "15%" },
    { icon: "🏷️", delay: 4, left: "15%", top: "70%" },
    { icon: "💰", delay: 1, left: "75%", top: "60%" },
    { icon: "📊", delay: 3, left: "50%", top: "10%" },
    { icon: "🛍️", delay: 5, left: "90%", top: "50%" },
    { icon: "📈", delay: 2.5, left: "5%", top: "50%" },
    { icon: "💳", delay: 3.5, left: "60%", top: "80%" },
    { icon: "🚚", delay: 1.5, left: "25%", top: "25%" },
    { icon: "📱", delay: 4.5, left: "80%", top: "75%" },
    { icon: "⭐", delay: 2, left: "40%", top: "40%" },
    { icon: "🎯", delay: 3, left: "70%", top: "30%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ecommerceIcons.map((item, index) => (
        <div
          key={index}
          className="absolute text-4xl md:text-5xl opacity-20 hover:opacity-30 transition-opacity animate-float"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: `${item.delay}s`,
            animationDuration: index % 2 === 0 ? "20s" : "25s",
          }}
        >
          {item.icon}
        </div>
      ))}
      
      {/* Floating gradient orbs */}
      <div className="absolute w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-30 -top-24 -left-24 animate-drift" />
      <div className="absolute w-[500px] h-[500px] bg-pink-400 rounded-full blur-3xl opacity-30 top-1/3 -right-24 animate-drift-reverse" />
      <div className="absolute w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-30 -bottom-12 left-1/4 animate-drift" />
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-25 top-1/2 right-1/5 animate-pulse-slow" />
    </div>
  );
}


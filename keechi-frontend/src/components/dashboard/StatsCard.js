import { ArrowUp, ArrowDown } from "lucide-react";

export function StatsCard({ title, value, icon: Icon, trend, trendValue, color = "gold" }) {
    const colorClasses = {
        gold: "bg-gold-50 text-gold-600",
        teal: "bg-teal-50 text-teal-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
    };

    return (
        <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {trend === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-charcoal-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-charcoal-900">{value}</p>
            </div>
        </div>
    );
}

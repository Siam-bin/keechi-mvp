import { Users, Star } from "lucide-react";

export function RepeatCustomersCard({ data }) {
    if (!data) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-charcoal-100 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-charcoal-900">Loyal Customers</h3>
                    <p className="text-sm text-charcoal-500">Returning clients</p>
                </div>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Users size={20} />
                </div>
            </div>

            <div className="mb-6">
                <p className="text-3xl font-bold text-charcoal-900">{data.count}</p>
                <p className="text-xs text-charcoal-500">Repeat customers total</p>
            </div>

            <div className="space-y-4">
                {data.top?.length > 0 ? (
                    data.top.map((customer, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 font-bold text-xs">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-charcoal-900">{customer.name}</p>
                                    <p className="text-xs text-charcoal-500">{customer.bookings} visits</p>
                                </div>
                            </div>
                            {index === 0 && <Star size={14} className="text-gold-500 fill-gold-500" />}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-charcoal-400 text-center py-2">No repeat customers yet</p>
                )}
            </div>
        </div>
    );
}

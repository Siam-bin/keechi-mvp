import { Calendar, Clock, User, Phone } from "lucide-react";

export function NextAppointmentCard({ appointment }) {
    if (!appointment) {
        return (
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center">
                <Calendar size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Upcoming Appointments</h3>
                <p className="text-teal-100">You're all caught up for now!</p>
            </div>
        );
    }

    const date = new Date(appointment.dateTime);

    return (
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-gold-500 opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-teal-100 text-sm font-medium mb-1">Next Appointment</p>
                        <h3 className="text-2xl font-bold">{appointment.service?.name}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                        {appointment.status}
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-teal-200">Time</p>
                            <p className="font-semibold">
                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                <span className="mx-2">•</span>
                                {appointment.service?.duration} min
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-teal-200">Customer</p>
                            <p className="font-semibold">{appointment.user?.name || appointment.customerName || "Guest"}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-auto">
                    {appointment.user?.phone && (
                        <a href={`tel:${appointment.user.phone}`} className="flex-1 bg-white text-teal-900 py-2 rounded-lg font-bold text-center flex items-center justify-center gap-2 hover:bg-teal-50 transition">
                            <Phone size={16} /> Call
                        </a>
                    )}
                    <button className="flex-1 bg-teal-700/50 text-white py-2 rounded-lg font-bold hover:bg-teal-700 transition border border-teal-500">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}

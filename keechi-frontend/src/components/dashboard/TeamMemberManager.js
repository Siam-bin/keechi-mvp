"use client";

import { useState, useEffect } from "react";
import { teamMemberService } from "@/lib/api";
import { Plus, Edit2, Trash2, User, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export function TeamMemberManager() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        specialties: "", // Comma separated string for input
    });

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const data = await teamMemberService.getMyTeamMembers();
            setTeamMembers(data);
        } catch (error) {
            console.error("Failed to fetch team members:", error);
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.role) {
            toast.error("Name and Role are required");
            return;
        }

        const payload = {
            ...formData,
            specialties: formData.specialties.split(",").map(s => s.trim()).filter(s => s),
        };

        try {
            if (editingMember) {
                await teamMemberService.updateTeamMember(editingMember.id, payload);
                toast.success("Team member updated successfully");
            } else {
                await teamMemberService.createTeamMember(payload);
                toast.success("Team member added successfully");
            }

            setShowForm(false);
            setEditingMember(null);
            setFormData({ name: "", role: "", bio: "", specialties: "" });
            fetchTeamMembers();
        } catch (error) {
            console.error("Error saving team member:", error);
            toast.error("Failed to save team member");
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio || "",
            specialties: member.specialties.join(", "),
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to remove this team member?")) return;

        try {
            await teamMemberService.deleteTeamMember(id);
            toast.success("Team member removed");
            fetchTeamMembers();
        } catch (error) {
            console.error("Error deleting team member:", error);
            toast.error("Failed to remove team member");
        }
    };

    if (loading && !teamMembers.length) {
        return <div className="p-8 text-center text-charcoal-500">Loading team...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-charcoal-900">Team Management</h2>
                <button
                    onClick={() => {
                        setEditingMember(null);
                        setFormData({ name: "", role: "", bio: "", specialties: "" });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition"
                >
                    <Plus size={18} /> Add Member
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold-100 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4">{editingMember ? "Edit Team Member" : "New Team Member"}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Name *</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                    placeholder="e.g. Sarah Jones"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Role *</label>
                                <input
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                    placeholder="e.g. Senior Stylist"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal-700 mb-1">Specialties (comma separated)</label>
                            <input
                                value={formData.specialties}
                                onChange={e => setFormData({ ...formData, specialties: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                placeholder="e.g. Haircut, Coloring, Spa"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal-700 mb-1">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                rows="3"
                                placeholder="Short bio about the team member..."
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-charcoal-600 hover:bg-charcoal-50 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gold-500 text-white rounded-lg font-bold hover:bg-gold-600"
                            >
                                Save Member
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                    <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-charcoal-100 hover:shadow-md transition group relative">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-charcoal-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {member.imageUrl ? (
                                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} className="text-charcoal-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-charcoal-900">{member.name}</h3>
                                <p className="text-gold-600 text-sm font-medium">{member.role}</p>
                                {member.bio && <p className="text-charcoal-500 text-sm mt-2 line-clamp-2">{member.bio}</p>}

                                {member.specialties && member.specialties.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {member.specialties.map((spec, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-charcoal-50 text-charcoal-600 text-xs rounded-full">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(member)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {teamMembers.length === 0 && !showForm && (
                    <div className="col-span-full py-12 text-center bg-charcoal-50 rounded-2xl border-2 border-dashed border-charcoal-200">
                        <User size={48} className="mx-auto text-charcoal-300 mb-4" />
                        <h3 className="text-lg font-bold text-charcoal-700">No Team Members Yet</h3>
                        <p className="text-charcoal-500 mb-6">Add your staff to let customers book with their favorite stylist.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-white border border-charcoal-300 text-charcoal-700 rounded-lg font-medium hover:bg-charcoal-50 transition"
                        >
                            Add First Member
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

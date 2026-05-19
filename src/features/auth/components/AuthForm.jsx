import React from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function AuthForm({
    title,
    subtitle,
    description,
    fields = [],
    onChange,
    onSubmit,
    buttonText,
    loading = false,
    footer,
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
            <div className="flex w-full max-w-3xl min-h-[560px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="hidden md:flex w-[42%] flex-col justify-between p-10 relative overflow-hidden bg-primary-700">
                    <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

                    <div className="z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L12 22M2 12H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M6 6C6 6 8 10 12 10C16 10 18 6 18 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm tracking-wide leading-none">DESOGHN</p>
                                <p className="text-white/60 text-[10px] font-medium tracking-[0.15em] mt-0.5">CLINIC</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-white text-[22px] font-bold leading-snug mb-3">Your Health,<br />Our Priority</h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                We're here to provide the best care for you and your family.
                            </p>
                        </div>
                    </div>

                    <div className="z-10 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-4">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
                                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/90 text-[12.5px] font-semibold mb-0.5">Trusted by patients</p>
                            <p className="text-white/55 text-[11.5px]">Compassionate care since 2010</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center px-8 py-10 bg-white">
                    <div className="w-full max-w-md mx-auto">
                        <div className="text-center mb-6">
                            <h1 className="text-[22px] font-bold text-gray-900">{title}</h1>
                            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                        </div>

                        {description && <p className="text-center text-sm text-gray-500 mb-8">{description}</p>}

                        <form onSubmit={onSubmit} className="space-y-4">
                            {fields.map((field, index) => (
                                field.type === "select" ? (
                                    <div key={index} className="flex flex-col gap-1">
                                        {field.label && (
                                            <label className="text-sm font-medium text-gray-700">
                                                {field.label}
                                            </label>
                                        )}
                                        <select
                                            name={field.name}
                                            value={field.value}
                                            onChange={(e) => onChange(field.name, e.target.value)}
                                            className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition"
                                        >
                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <Input
                                        key={index}
                                        name={field.name}
                                        label={field.label}
                                        type={field.type}
                                        value={field.value}
                                        placeholder={field.placeholder}
                                        onChange={(e) => onChange(field.name, e.target.value)}
                                        className="w-full h-11 pl-4 pr-4 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition"
                                    />
                                )
                            ))}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? "Loading..." : buttonText}
                            </Button>
                        </form>

                        {footer && <div className="mt-6">{footer}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}




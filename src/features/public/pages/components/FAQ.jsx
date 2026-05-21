import { useState } from "react";

function FAQ() {

    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Comment prendre un rendez-vous ?",
            answer: "Vous pouvez prendre un rendez-vous en selectionnant un medecin puis un creneau disponible."
        },
        {
            question: "Les consultations en ligne sont-elles disponibles ?",
            answer: "Oui, vous pouvez consulter les medecins en ligne via video ou chat."
        },
        {
            question: "Puis-je annuler mon rendez-vous ?",
            answer: "Oui, vous pouvez annuler ou reprogrammer votre rendez-vous depuis votre tableau de bord."
        },
        {
            question: "Mes donnees medicales sont-elles securisees ?",
            answer: "Oui, toutes vos donnees sont chiffrees et stockees en toute securite."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 px-10 bg-primary-50">

            {/* Header */}
            <div className="text-center mb-14">

                <p className="text-primary-600 font-semibold mb-3">
                    FAQ
                </p>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Questions frequentes
                </h1>

                <p className="text-slate-600 max-w-2xl mx-auto">
                    Retrouvez les reponses aux questions les plus posees sur notre plateforme medicale.
                </p>

            </div>

            {/* FAQ List */}
            <div className="max-w-3xl mx-auto space-y-4">

                {faqs.map((item, index) => (

                    <div
                        key={index}
                        className="bg-white/95 rounded-3xl shadow-sm p-5 cursor-pointer border border-primary-100"
                        onClick={() => toggleFAQ(index)}
                    >

                        {/* Question */}
                        <div className="flex justify-between items-center">

                            <h3 className="font-semibold text-slate-900">
                                {item.question}
                            </h3>

                            <span className="text-primary-600 text-xl">
                                {openIndex === index ? "−" : "+"}
                            </span>

                        </div>

                        {/* Answer */}
                        {openIndex === index && (
                            <p className="text-slate-600 mt-3 text-sm leading-6">
                                {item.answer}
                            </p>
                        )}

                    </div>

                ))}

            </div>

        </section>
    );
}

export default FAQ;


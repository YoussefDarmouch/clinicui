import { useState } from "react";

function FAQ() {

    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How can I book an appointment?",
            answer: "You can book an appointment by selecting a doctor and choosing an available time slot."
        },
        {
            question: "Are online consultations available?",
            answer: "Yes, you can consult doctors online through video or chat."
        },
        {
            question: "Can I cancel my appointment?",
            answer: "Yes, you can cancel or reschedule your appointment from your dashboard."
        },
        {
            question: "Is my medical data secure?",
            answer: "Yes, all your data is encrypted and securely stored."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 px-10 bg-blue-50">

            {/* Header */}
            <div className="text-center mb-14">

                <p className="text-blue-600 font-semibold mb-3">
                    FAQ
                </p>

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Frequently Asked Questions
                </h1>

                <p className="text-gray-600 max-w-2xl mx-auto">
                    Find answers to the most common questions about our medical platform.
                </p>

            </div>

            {/* FAQ List */}
            <div className="max-w-3xl mx-auto space-y-4">

                {faqs.map((item, index) => (

                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm p-5 cursor-pointer"
                        onClick={() => toggleFAQ(index)}
                    >

                        {/* Question */}
                        <div className="flex justify-between items-center">

                            <h3 className="font-semibold text-gray-800">
                                {item.question}
                            </h3>

                            <span className="text-blue-600 text-xl">
                                {openIndex === index ? "−" : "+"}
                            </span>

                        </div>

                        {/* Answer */}
                        {openIndex === index && (
                            <p className="text-gray-600 mt-3 text-sm leading-6">
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
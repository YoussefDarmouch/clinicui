import React from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function AuthForm({
    title,
    fields = [],
    onChange,
    onSubmit,
    buttonText,
    loading = false,
    footer,
}) {
    return (
        <div style={styles.container}>
            <h2>{title}</h2>

            <form onSubmit={onSubmit} style={styles.form}>
                {fields.map((field, index) => (
                    <Input
                        key={index}
                        label={field.label}
                        type={field.type}
                        value={field.value}
                        placeholder={field.placeholder}
                        onChange={(e) =>
                            onChange(field.name, e.target.value)
                        }
                    />
                ))}

                <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : buttonText}
                </Button>
            </form>


            {footer && <div style={styles.footer}>{footer}</div>}
        </div>
    );
}

const styles = {
    container: {
        width: "320px",
        margin: "auto",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    footer: {
        marginTop: "10px",
    },
};
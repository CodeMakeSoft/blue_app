import React from "react";
import { InputLabel, InputError } from "./InputComponents";

const DescriptionInput = ({ data, setData, errors }) => {
    const descriptionLength = data.description?.length || 0;
    const MAX_LENGTH = 200;

    const getFeedback = () => {
        if (descriptionLength === 0) return "Escribe una descripción";
        if (descriptionLength < 50) return "Muy corta (mínimo 50 caracteres)";
        if (descriptionLength < 150) return "Buena (sugerido 150+ caracteres)";
        return "Excelente descripción";
    };

    const getFeedbackColor = () => {
        if (descriptionLength === 0) return "text-gray-500";
        if (descriptionLength < 50) return "text-red-600";
        if (descriptionLength < 150) return "text-amber-500";
        return "text-emerald-600";
    };

    return (
        <div className="relative">
            <InputLabel htmlFor="description" value="Descripción*" />
            <textarea
                id="description"
                name="description"
                value={data.description || ""}
                maxLength={MAX_LENGTH}
                className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setData("description", e.target.value)}
            />
            <InputError message={errors.description} />

            <div className="mt-2 space-y-1">
                <p
                    className={`text-sm ${getFeedbackColor()}`}
                    aria-live="polite"
                >
                    {getFeedback()}
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                            className={`h-full rounded-full ${
                                descriptionLength < 50
                                    ? "bg-red-600"
                                    : descriptionLength < 150
                                    ? "bg-amber-500"
                                    : "bg-emerald-600"
                            }`}
                            style={{
                                width: `${
                                    (descriptionLength / MAX_LENGTH) * 100
                                }%`,
                            }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">
                        {descriptionLength}/{MAX_LENGTH}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DescriptionInput;

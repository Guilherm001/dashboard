'use client'

import React from "react";

type tip = {
    title: string;
    valor: string;
    seta: string;
}


export default function EstruturaCard(props: tip) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-xl font-semibold mb-4">{props.title}</h3>
        <p className="text-gray-600">{props.valor}</p>
        <p className="text-green-500">{props.seta}</p>
        </div>
    );
}
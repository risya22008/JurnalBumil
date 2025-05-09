import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

const defaultLabelMap = {
    berat_badan: 'Berat Badan (kg)',
    lila: 'Lingkar Lengan Atas (cm)',
    tinggi_rahim: 'Tinggi Rahim (cm)',
    denyut_janin: 'Denyut Nadi Janin (b/m)',
    tekanan_darah: 'Tekanan Darah (mmHg)',
    hemoglobin: 'Hemoglobin (g/dl)',
    gula_darah: 'Gula Darah (mg/dl)',
    imunisasi_tetanus: 'Imunisasi Tetanus (dosis)',
    tablet_tambah_darah: 'Tablet Tambah Darah (butir)'
};

const defaultSatuanMap = {
    berat_badan: 'kg',
    lila: 'cm',
    tinggi_rahim: 'cm',
    denyut_janin: 'b/m',
    tekanan_darah: 'mmHg',
    hemoglobin: 'g/dl',
    gula_darah: 'mg/dl',
    imunisasi_tetanus: 'dosis',
    tablet_tambah_darah: 'butir'
};

const GrafikLapKun = ({ data, labelMap = defaultLabelMap, satuanMap = defaultSatuanMap }) => {
    const [activeKey, setActiveKey] = useState(Object.keys(labelMap)[0]);

    const maxValue = Math.max(...data.map(item => Number(item[activeKey]) ?? 0), 0);


    return (
        <div className="lapkun-container">
            <div className="lapkun-title font-semibold text-lg mb-4">
                {labelMap[activeKey]}
            </div>

            <ResponsiveContainer height={380}>
                <LineChart data={data}>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <XAxis
                        dataKey="x"
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                        }}
                    />
                    <YAxis domain={[0, maxValue + 2]}>
                        <Label
                            value={satuanMap[activeKey]}
                            offset={10}
                            position="top"
                            style={{ textAnchor: 'start', fontSize: '12px', fill: '#555' }}
                        />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={activeKey}
                        name={labelMap[activeKey]}
                        stroke="#0000FF"
                        strokeWidth={3}
                        dot={{ r: 6, stroke: '#0000FF', strokeWidth: 2, fill: '#FFFFFF' }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="lapkun-button-container flex flex-wrap gap-2 mt-4">
                {Object.entries(labelMap).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActiveKey(key)}
                        className={`px-3 py-2 rounded-lg text-sm ${activeKey === key ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GrafikLapKun;

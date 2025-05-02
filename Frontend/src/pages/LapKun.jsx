import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';
import "../App.css";

const LapKun = () => {
  const [activeKey, setActiveKey] = useState('berat_badan');

  const data = [
    {
      x: '2025-04-25',
      berat_badan: 50,
      lila: 24,
      tinggi_rahim: 30,
      denyut_janin: 140,
      tekanan_darah: 110,
      hemoglobin: 11.5,
      gula_darah: 90,
      imunisasi_tetanus: 1,
      tablet_tambah_darah: 2
    },
    {
      x: '2025-04-26',
      berat_badan: 51,
      lila: 24,
      tinggi_rahim: 31,
      denyut_janin: 138,
      tekanan_darah: 112,
      hemoglobin: 11.7,
      gula_darah: 95,
      imunisasi_tetanus: 1,
      tablet_tambah_darah: 2
    },
    {
      x: '2025-04-27',
      berat_badan: 52,
      lila: 25,
      tinggi_rahim: 32,
      denyut_janin: 145,
      tekanan_darah: 115,
      hemoglobin: 12.0,
      gula_darah: 100,
      imunisasi_tetanus: 2,
      tablet_tambah_darah: 3
    },
    {
      x: '2025-04-28',
      berat_badan: 53,
      lila: 25,
      tinggi_rahim: 33,
      denyut_janin: 143,
      tekanan_darah: 117,
      hemoglobin: 12.2,
      gula_darah: 92,
      imunisasi_tetanus: 2,
      tablet_tambah_darah: 4
    }
  ];

  const labelMap = {
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

  const satuanMap = {
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

  const maxValue = Math.max(...data.map(item => item[activeKey]));

  return (
    <div className="lapkun-container">
      <div className="lapkun-title">
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

      <div className="lapkun-button-container">
        {Object.entries(labelMap).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`lapkun-button ${activeKey === key ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LapKun;

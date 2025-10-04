import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Python', progress: 80 },
  { name: 'Data Cleaning', progress: 60 },
  { name: 'Visualization', progress: 70 },
  { name: 'ML', progress: 50 },
  { name: 'Advanced', progress: 40 },
];

function InteractiveCharts() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="progress" fill="#1E3A8A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InteractiveCharts;

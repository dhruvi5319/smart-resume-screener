
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from "recharts";

interface MatchScoreChartProps {
  score: number;
}

const MatchScoreChart = ({ score }: MatchScoreChartProps) => {
  // Convert score to percentage if not already
  const percentage = score > 1 ? score : score * 100;
  
  // Calculate remaining percentage
  const remaining = 100 - percentage;
  
  const data = [
    { name: "Match Score", value: percentage },
    { name: "Gap", value: remaining }
  ];

  // Determine color and label based on score
  let color, matchLabel;
  if (percentage >= 85) {
    color = "#1cad61"; // success-500
    matchLabel = "Excellent Match";
  } else if (percentage >= 70) {
    color = "#5fb832"; // success-400
    matchLabel = "Strong Match";
  } else if (percentage >= 55) {
    color = "#f98204"; // warning-500
    matchLabel = "Good Match";
  } else if (percentage >= 40) {
    color = "#ff9800"; // warning-400
    matchLabel = "Potential Match";
  } else {
    color = "#ea384c"; // red
    matchLabel = "Low Match";
  }

  const COLORS = [color, "#e4eeff"]; // second color is a light gray

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Match Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label
                  value={`${percentage.toFixed(0)}%`}
                  position="center"
                  fill={color}
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    fontFamily: 'inherit'
                  }}
                />
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-lg font-medium" style={{ color }}>
              {matchLabel}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchScoreChart;

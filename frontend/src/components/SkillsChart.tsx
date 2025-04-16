import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skill } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SkillsChartProps {
  skills: Skill[];
}

const SkillsChart = ({ skills }: SkillsChartProps) => {
  const sortedSkills = [...skills].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedSkills}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Match']} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="score" name="Skill Match" radius={[0, 4, 4, 0]}>
                {sortedSkills.map((entry, index) => {
                  let color;
                  if (entry.isMatch) {
                    if (entry.score >= 80) color = "#1cad61";
                    else if (entry.score >= 50) color = "#f98204";
                    else color = "#ea384c";
                  } else {
                    color = "#a7c7ff";
                  }
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsChart;

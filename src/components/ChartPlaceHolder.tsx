import React from "react";
import Card from "@material-ui/core/Card";
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,  
  Legend,
} from 'recharts';

export default (props:any) => {
  return (
    <Card >
      <LineChart
        width={1200}
        height={600}
        data={props.data}
      >
        <CartesianGrid strokeDasharray="6 6" />
        <XAxis dataKey="at" />
        <YAxis unit={props.data[0].unit} type="number" domain={['auto','auto']} />
        <Legend />
        <Line name={props.data[0].metric} unit={props.data[0].unit} type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </Card>
  );
};

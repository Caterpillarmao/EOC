//This component could not get working, see the ChartPlaceHolder component.


import React from "react";
import Card from "@material-ui/core/Card";
import { useSelector } from "react-redux";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend,
} from 'recharts';

const getData = (state: any) => {
  const {data} = state.data;
  return data.map((measurement: any) => {
    return{
      ...measurement,
      at: (new Date(measurement.at))
      .toTimeString()
      .match(/^\d\d:\d\d/)[0],
    };
  });
};

const useStyles = makeStyles({
  card: {
    display: "flex"
  }
});
const Chart = () => {
  const data = useSelector(
    getData
  );
  if( !data ) return <div></div>;
  if ( data.length === 0 ) return <div></div>;
  const classes = useStyles()
  return (
    <Card className={classes.card}> 
      <CardContent>
      <LineChart
        width={1800}
        height={400}
        data={data}
      >
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="at" />
        <YAxis unit={data[0].unit} type="number" domain={['auto','auto']} />
        <Legend />
        <Line name={data[0].metric} unit={data[0].unit} type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
      </CardContent>
    </Card>
  );
};

export default Chart;
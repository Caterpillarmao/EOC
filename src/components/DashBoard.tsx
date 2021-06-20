import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { SubscriptionClient } from "subscriptions-transport-ws";
import {  
  Provider, 
  createClient, 
  useQuery,
  useSubscription, 
  defaultExchanges, 
  subscriptionExchange  } from "urql";
import DataVisualize from "./DataVisualize";
const subscriptionClient = new SubscriptionClient("ws://react.eogresources.com/graphql", {});

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [...defaultExchanges, subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
  })]
});

const measurementQuery = `
query($input: MeasurementQuery!) {
  getMeasurements(input: $input) {
    metric
    at
    value
    unit
  }
}
`;
const measurementSubscriptionQuery = `
subscription{
    newMeasurement{
        metric
        value
        unit
        at
    }
}
`;
const handleSubscription = (measurements = [], response: any) => {
  return [response.newMeasurement, ...measurements] ?  [response.newMeasurement, ...measurements] : [];
};

export default (props: any) => {
  return (
    <Provider value={client}>
      <Dashboard {...props}/>
    </Provider>
  );
};

const Dashboard = (props: any) => {
  const thirtyMinInterval = 30 * 60 * 1000;
  const input = {
    metricName: String(props.metricName),
    before: parseInt(props.loadTimestamp),
    after: parseInt(props.loadTimestamp)-thirtyMinInterval,
  };

  const [result] = useQuery({
    query: measurementQuery,
    variables: {
      input,
    },
  });

  const [res] = useSubscription({ query: measurementSubscriptionQuery }, handleSubscription);  
  if (!res.data) {
    return <p>No data</p>;
  }

  interface Measure {
    metric: string
  }
  //I know this is janky to put it kindly, but a MVP dashboard is now updating with working subscriptions.
  const filteredTubingP = res.data.filter(measurement => (measurement.metric === "tubingPressure"))
  const tpData = filteredTubingP.slice(0,1).map(measurement => measurement.value)
  const filteredCasingP = res.data.filter(measurement => measurement.metric === "casingPressure")
  const cpData = filteredCasingP.slice(0,1).map(measurement => measurement.value)
  const filteredOilT = res.data.filter(measurement => measurement.metric === "oilTemp")
  const otData = filteredOilT.slice(0,1).map(measurement => measurement.value)
  const filteredFlareT = res.data.filter(measurement => measurement.metric === "flareTemp")
  const ftData = filteredFlareT.slice(0,1).map(measurement => measurement.value)
  const filteredWaterT = res.data.filter(measurement => measurement.metric === "waterTemp")
  const wtData = filteredWaterT.slice(0,1).map(measurement => measurement.value)
  const filteredInjValve = res.data.filter(measurement => measurement.metric === "injValveOpen")
  const injValveData = filteredInjValve.slice(0,1).map(measurement => measurement.value)
  //the design intent here was on each click of the avatar button, that selected metric's chart would load below to see historical data.
  return (
    <Card>
      <CardContent>
        <List style={{display:"flex"}}>
          <ListItem>
            <ListItemText primary={`Tubing Pressure:${tpData} PSI`} />
          </ListItem>
          <ListItem>
            
            <ListItemText primary={`Casing Pressure:${cpData} PSI`} />
          </ListItem>
          <ListItem>
            
            <ListItemText primary={`Oil Temp:${otData} F`} />
          </ListItem>
          <ListItem>
            
            <ListItemText primary={`Flare Temp:${ftData} F`} />
          </ListItem>
          <ListItem>
           
            <ListItemText primary={`Water Temp:${wtData} F`} />
          </ListItem>
          <ListItem>
            
            <ListItemText primary={`injValve Open:${injValveData} %`} />
          </ListItem>
        </List>
      </CardContent>
      <DataVisualize query={result.data} data={res.data}/>
    </Card>
  );
};

import React, { useState } from 'react';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function App() {
  const [chartData, setChartData] = useState(); // chart data
  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Lumber Futures Data',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    scaleShowGridLines: true,
    scaleShowVerticalLines: true,
  });

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="title">Olympic Industries Lumber Futures Data Visualization</h2>
        <p className="p">To display graph, first select a value from the dropdown.</p>
        <select id="dataType" className='dataTypeDropdown' onChange={
          (e) => {
            fetch(`/data?type=${e.target.value}`)
              .then(res => res.json())
              .then(data => {
                var lumberData = data.allData;
                setChartData({
                  labels: lumberData.map((data) => data.date),
                  datasets: [
                    {
                      label: e.target.value,
                      data: lumberData.map((data) => data.value),
                      fill: true,
                      borderColor: 'rgb(75, 192, 192)',
                    },
                  ],
                });
                setOptions({
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `Lumber Futures ${e.target.value} Data`,
                    },
                  },
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: 'Value',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date',
                      },
                    },
                  },
                  scaleShowGridLines: true,
                  scaleShowVerticalLines: true,
                });
            }).catch(err => console.log(err));
          }
        } defaultValue="default">
          <option value="default" disabled>Select Value</option>
          <option value="Open">Open</option>
          <option value="High">High</option>
          <option value="Low">Low</option>
          <option value="Close">Close</option>
          <option value="AdjClose">AdjClose</option>
          <option value="Volume">Volume</option>
        </select>
        {chartData ? <div class="chart"><Line data={chartData} options={options} /></div> : null}
      </header>
      <div>
        <p className="p">Created by Shrill Patel</p>
      </div>
    </div>
  );
}

export default App;

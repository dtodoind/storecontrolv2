import React, { useEffect, useState, useRef } from "react";

import "./Home.scss";
import Overall from "../../Components/Overall/Overall";
// import { LineData } from "../../Data/LineData";
import LineChart from "../../Components/LineChart/LineChart";
import Notification from "../../Components/Notification/Notification";
import "chart.js/auto";
import DisplayStock from "../../Components/DisplayStocks/DisplayStock";
import Orders from "../Orders/Orders";
import axios from "axios";
import { connect } from "react-redux";
import DetailsProduct from "../../Components/DetailsProduct/DetailsProduct";
import TransferStock from "../../Components/TransferStock/TransferStock";
import { store_Expensecat, store_Expenses } from "../../Functions/AllFunctions";

// prettier-ignore
function Home(props) {

    const { Products, Sales_Activity, allsalesactivity, Order, allorders, Status, Notific, notify, expense_category, Expenses, allexp, Expensecat, Deposito } = props

    const chartRef = useRef();

    function createGradient(ctx, area) {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

        gradient.addColorStop(0, "rgba(16, 116, 231, 0.0)");
        gradient.addColorStop(0.5, "rgba(16, 116, 231, 0.2)");
        gradient.addColorStop(1, "rgba(16, 116, 231, 0.6)");

        return gradient;
    }

    const [saleData, setSaleData] = useState({
        datasets: [],
    });
    const [options, setOptions] = useState();

    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [select_year, setSelectYear] = useState();
    const [select_month, setSelectMonth] = useState();

    const [details_data, setDetailsData] = useState(null)
	const [stocknum, setStockNum] = useState()
    const [co, setCo] = useState(null)
    const [allorder, setAllOrders] = useState()
    const[idMod] = useState("idModalDash");

    const details = (pro, index) => {
		setDetailsData(pro)
        setCo(index)
	}

    const stocktransfer = (val) => {
		setStockNum(val)
	}
  
    const loop = useRef(true)
    const notify_loop = useRef(true)

    const sortingval = (e) => {
        if (e.target.name === "year") {
            setSelectYear(e.target.value);
        } else if (e.target.name === "month") {
            setSelectMonth(e.target.value);
        }
    };
    
    useEffect(() => {
        let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        async function linedata() {
            // await store_SalesActivity('Home', Status, Sales_Activity, allsalesactivity)
            await store_Expenses('Home', Status, Expenses, allexp)
            await store_Expensecat('Home', Status, Expensecat, expense_category)
        }
        
        if(loop.current) {
            linedata()
            loop.current = false
        }
        if(notify_loop.current) {
            if(Status) {
                var DepositoLogin = JSON.parse(localStorage.getItem("DepositoLogin"))
                if(Notific.length !== 0 && Sales_Activity.length !== 0) {
                    var flag = 0
                    var date = new Date()
                    var y = date.getFullYear()
                    var m = date.getMonth();
                    // var firstDay = new Date(y, m, 30).toLocaleString();
                    // var lastDay = new Date(y, m + 1, 0).toLocaleString();
                    for(var i=0; i<Notific.length; i++) {
                        // console.log(Notific[i].Title === 'Last Month Earnings')
                        if(Notific[i].Title === 'Last Month Earnings') {
                            var last_month = new Date(Notific[i].Date).getMonth()
                            var last_year = new Date(Notific[i].Date).getFullYear()
                            // console.log(last_month, m)
                            // console.log(last_year, y)
                            // console.log(last_month === m && last_year === y)
                            if(last_month === m && last_year === y && Notific[i].Sender_id === DepositoLogin?.Deposito_id) {
                                flag = 1
                                break
                            }
                        }
                        // console.log("--------------------------")
                    }
                    // console.log(flag)
                    if(flag === 0) {
                        // console.log(Notific)
                        var total_prev = 0
                        var total_curr = 0
                        let data_year = Sales_Activity.filter(function (x) {
                            return x.year === y;
                        })[0];
                        var month_prev = data_year[months_data[m-2]]
                        var month_curr = data_year[months_data[m-1]]
                        for (let o = 0; o < month_prev.length; o++) {
                            total_prev = total_prev + month_prev[o].sales;
                        }
                        for (let o = 0; o < month_curr.length; o++) {
                            total_curr = total_curr + month_curr[o].sales;
                        }
                        // console.log(total_prev, total_curr)
                        var total_amount = total_curr + total_prev
                        var percentage = 0
                        if(total_curr < total_prev) {
                            percentage = (total_prev / total_amount) * 100
                        } else if(total_curr > total_prev) {
                            percentage = (total_curr / total_amount) * 100
                        }
                        // console.log(`${total_curr < total_prev ? '-' : ''}${percentage}`)
                        axios.post("https://storecontrolserverv2-production-3675.up.railway.app/notification/new",{
                            Title: 'Last Month Earnings',
                            Message : `${DepositoLogin?.Type === 'Master Manager' ? 'Overall Store' : DepositoLogin?.nombre} ingresos del último mes fueron ${total_curr < total_prev ? 'no': ''} mejor que el mes anterior. ¿Has ganado ${total_curr < total_prev ? ' -' : ''}${percentage}% ${total_curr < total_prev ? ' Menos ': ' más '}.`,
                            // Message:  `Your Last month earnings was ${total_curr < total_prev ? ' not ' : ''} better then the month before that. You have earned ${total_curr < total_prev ? ' -' : ''}${percentage}% ${total_curr < total_prev ? ' less ' : ' more '}.`,
                            Sender_id: DepositoLogin?.Deposito_id,
                            Date: new Date().toLocaleString("en-US")
                        }).then(async (item) => {
                            var note = Notific
                            note.push(item.data)
                            note.sort(function (d1, d2) {
                                return new Date(d2.createdAt) - new Date(d1.createdAt);
                            });
                            await axios.get("https://storecontrolserverv2-production-3675.up.railway.app/notification").then(async item => {
                                item.data.sort(function (d1, d2) {
                                    return new Date(d2.createdAt) - new Date(d1.createdAt);
                                });
                                notify(item.data)
                                if(window.desktop) {
                                    await window.api.addData(item.data, "Notification")
                                }
                            })
                        }).catch((err) => { console.log(err) })
                    }
                    notify_loop.current = false
                }
            }
        }

        async function order_storing() {
			if(JSON.parse(localStorage.getItem('DepositoLogin'))?.Type !== 'Master Manager') {
				var result = []
                for (let i = 0; i < Order.length; i++) {
                    var all_deposit = []
                    all_deposit.push(DepositoLogin?.nombre)
                    var filter_deposit = Deposito.find(ele => ele.nombre === Order[i].Deposito_name && ele.Deposito_id_fk === DepositoLogin?.Deposito_id && ele.Type === 'Store')
                    var fk_deposit = Deposito.find(ele2 => ele2.Deposito_id === DepositoLogin?.Deposito_id_fk)
                    if(filter_deposit) all_deposit.push(filter_deposit.nombre)
                    if(fk_deposit) all_deposit.push(fk_deposit.nombre)
                    if (all_deposit.includes(Order[i].Deposito_name)) {
                        result.push(Order[i])
                    }
                }
				setAllOrders(result)
			} else {
				setAllOrders(Order)
			}
		}
		order_storing()

        const chart = chartRef.current;
        const labels_data = () => {
            let label_data = [];
            let total = [];
            if(Sales_Activity.length !== 0) {
                // var log = JSON.parse(localStorage.getItem('DepositoLogin'))
                // console.log(Sales_Activity.filter(element => element.year === new Date().getFullYear() && log.Deposito_id === element.Deposito_id))
                let months_data = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
                if (!select_year || select_year === "All") {
                    for (var k = 0; k < Sales_Activity.length; k++) {
                        var one_month_total = [];
                        label_data.push(Sales_Activity[k].year);
                        for (var p = 0; p < months_data.length; p++) {
                            var one_month_year = 0;
                            for (var o = 0; o < Sales_Activity[k][months_data[p]].length; o++) {
                                one_month_year = one_month_year + Sales_Activity[k][months_data[p]][o].sales;
                            }
                            one_month_total.push(one_month_year);
                        }
                        total.push(one_month_total.reduce((partialSum, a) => partialSum + a,0));
                        // console.log(one_month_total)
                    }
                    setYears(label_data);
                    setMonths(months_data);
                } else if (select_month === "All") {
                    let data_year = Sales_Activity.filter(function (x) {
                        return x.year === parseInt(select_year);
                    })[0];
                    for (let p = 0; p < months_data.length; p++) {
                        let one_month_year = 0;
                        for (let o = 0; o < data_year[months_data[p]].length; o++) {
                            one_month_year = one_month_year + data_year[months_data[p]][o].sales;
                        }
                        total.push(one_month_year);
                    }
                    months_data.map((item) => label_data.push(item));
                } else {
                    var data_year = Sales_Activity.filter(function (x) {
                        return x.year === parseInt(select_year);
                    })[0];
                    var data_month = typeof data_year[select_month] === 'string' ? JSON.parse(data_year[select_month]) : data_year[select_month];
                    data_month.map((item) => label_data.push(item.day));
                    data_month.map((item) => total.push(item.sales));
                }
                // console.log(label_data)
                if (!select_year) setSelectYear(label_data[label_data.length - 1]);
                if (!select_month) setSelectMonth(months_data[new Date().getMonth()]);
                // console.log(total)
            }
            return [label_data, total];
        };

        if (!chart) {
            return;
        }

        // var {label_data, total} = labels_data()
        // console.log(labels_data()[1])

        const sales = {
            labels: labels_data()[0],
            datasets: [
                {
                    label: "Sales",
                    data: labels_data()[1],
                    maintainAspectRatio: true,
                    backgroundColor: createGradient(chart.ctx, chart.chartArea),
                    borderColor: "rgb(16, 116, 231)",
                    pointBackgroundColor: "rgba(0,0,0,0)",
                    pointBorderColor: "rgba(0,0,0,0)",
                    pointHoverBackgroundColor: "rgb(16,166,231)",
                    pointHoverBorderColor: "rgb(255,255,255)",
                    pointHoverRadius: 7,
                    pointHoverBorderWidth: 3,
                    tension: 0.5,
                    fill: true,
                },
            ],
        };

        const option = {
            interaction: {
                intersect: false,
                mode: "index",
            },
            plugins: {
                responsive: true,
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    displayColors: false,
                    position: "average",
                    yAlign: "bottom",
                    backgroundColor: "rgb(255,255,255)",
                    titleColor: "rgb(0,0,0)",
                    bodyColor: "rgb(0,0,0)",
                    bodyAlign: "center",
                    bodyFont: {
                        size: 16,
                        weight: "bold",
                    },
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.1)",
                    padding: 13,
                    caretPadding: 10,
                    boxPadding: 0,
                    callbacks: {
                        title: function () {},
                        label: function (context) {
                            if (context.parsed.y !== null) {
                                let label = "";
                                label += new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(context.parsed.y);
                                return label;
                            }
                        },
                    },
                },
            },
            scales: {
                xAxis: {
                    grid: {
                        display: false,
                    },
                },
                yAxis: {
                    grid: {
                        display: false,
                    },
                },
            },
        };

        setSaleData(sales);
        setOptions(option);
    }, [Sales_Activity, allsalesactivity, select_month, select_year, Status, Notific, notify, Expensecat, Expenses, allexp, expense_category, Products, allorders, Order, Deposito]);

    // -----------------------------------
    // ----------DATA OVERALL TOP---------
    // -----------------------------------
    // console.log(allorder?.reduce((acc, value )=> acc + value.Total_price, 0))
    let totalVentas = allorder?.reduce((acc, value )=> acc + value.Total_price, 0);
    let totalexpenses = Expenses?.reduce((acc, value )=> acc + parseInt(value.Total), 0);
    let totalBalance = 0;
    totalBalance += totalVentas - totalexpenses
    
    return (
        <div className="home">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md p-2">
                        <Overall
                            title="Balance Total"
                            price={totalBalance}
                            color="rgb(0,123,255)"
                            icon={require("../../assets/Balance.png")}
                        />
                    </div>
                     <div className='col-md p-2'>
						<Overall title="Ventas Total" price={totalVentas} color="rgb(255,193,7)" icon={require('../../assets/Ventas.png')} />
					</div> 
                    <div className="col-md p-2">
                        <Overall
                            title="Expenses Total"
                            price={totalexpenses}
                            color="rgb(122,0,255)"
                            icon={require("../../assets/Expenses.png")}
                        />
                    </div>
                </div>
            </div>
            <div className="container-fluid my-2">
                <div className="row">
                    <div className="col-md-8">
                        <div className="charts" id="charts">
                            <LineChart
                                chartData={saleData}
                                options={options}
                                chartRef={chartRef}
                                sortingval={sortingval}
                                select_year={select_year}
                                select_month={select_month}
                                years={years}
                                months={months}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <Notification/>
                    </div>
                </div>
            </div>
            <div className="container-fluid my-4">
                <div className="row">
                    <div className="col-md">
                        <div className="productos">
                            <div>
                                <span className="productos_title">Ventas</span>
                            </div>
                            <div style={{ height: 400, overflow: "auto" }}>
                                <Orders searchbox={false}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="productos">
                            <div>
                                <span className="productos_title">
                                    Productos mas Vendidos
                                </span>
                            </div>
                            <DisplayStock details={details} stocknum={stocknum} idMod={idMod} />
                        </div>
                    </div>
                </div>
            </div>
          
            <DetailsProduct details_data={details_data} idModal={idMod} setDetailsData={setDetailsData} index={co} stocktransfer={stocktransfer} />
            <TransferStock details_data={details_data} stocknum={stocknum} />
       </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Order: state.Orders,
        Deposito: state.Deposito,
        Sales_Activity: state.Sales_Activity,
        Status: state.Status,
        Notific: state.NotifyMaster,
        Expenses: state.Expenses,
        Expensecat: state.Expensecat,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
        allexp: (val) => {
            dispatch({
                type: "EXPENSES",
                item: val,
            });
        },
        expense_category: (val) => {
            dispatch({
                type: "EXPENSECAT",
                item: val,
            });
        },
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

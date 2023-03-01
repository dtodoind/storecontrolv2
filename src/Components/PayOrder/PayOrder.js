import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./PayOrder.scss";
import axios from "axios";
import { connect } from "react-redux";
import Dropdown from "../Dropdown/Dropdown";
import NewClient from "../../Components/NewClient/NewClient";
// import { store_SalesActivity } from "../../Functions/AllFunctions";
// import NotifyAuto from "../SendMessage/NotifyAuto";

// prettier-ignore
function PayOrder({ Province, deposit, details_data, setDetailsData, order, setOrder, setOrderReturn, setOrder_Data, returnProduct, return_val, setProvince=null, setReturnedData = null, setOrderDetails = null, returned_data = null, ...props }) {

    const {Clients,  Products, allproduct, Orders, allorders, Sales_Activity, allsalesactivity, notify, Notific, Status, allClients } = props
    // if(details_data !== null) {
    //     var code = Products?.filter((p) => p.Product_id === details_data[0]?.Product_id)[0]
    //     for(var c=0; c<code.codigo.length; c++) {
    //         var index_code = code.codigo[c].findIndex(s => s === details_data[0].code)
    //         if(index_code !== -1) {
    //             console.log(code.Stock[c][index_code])
    //             NotifyAuto(code.nombre, code.Stock[c][index_code])
    //         }
    //     }
    // }
    // console.log(Sales_Activity)

    const [payment, setPayment] = useState(null)
    const [client_name, setClientName] = useState('')
    const [, setErrorMsg] = useState(false)
    const [payerr, setPayErr] = useState(false)

    // const loop = useRef(true)

    const onChange = (e) => {
        setPayErr(false)
        setPayment(e.target.value)
    }

    useEffect(() => {
        if (order?.Metodo_de_Pago !== undefined) {
            setPayment(order.Metodo_de_Pago)
            setClientName(order.Client_name)
        }
        // async function fetchSale() {
        //     if (Clients.length === 0) {
        //         if (Status) {
        //             // await store_SalesActivity('PayOrder', Status, Sales_Activity, allsalesactivity)
        //             // await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity')
        //             //     .then(async item => {
        //             //         var main_data = item.data
        //             //         let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        //             //         for(var t=0; t < main_data.length; t++) {
        //             //             for(var m=0; m < months_data.length; m++) {
        //             //                 main_data[t][months_data[m]] = JSON.parse(main_data[t][months_data[m]])
        //             //             }
        //             //         }
        //             //         allsalesactivity(main_data)
        //             //     })
        //         } else {
        //             // if (window.desktop) {
        //             //     await window.api.getAllData("Sales_Activity").then((item) => allsalesactivity(item.Sales_Activity));
        //             // }
        //         }
        //     }
        // }
        // if (loop.current) {
        //     fetchSale()
        //     loop.current = false
        // }
    }, [Clients, allClients, Status, order, Province])

    const createOrder = async (e, val) => {
        e.preventDefault()
        let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        if (val) {
            if (client_name === '') {
                setErrorMsg(true)
            } else if (payment === null) {
                setPayErr(true)
            } else {
                let o = order
                if (val) {
                    o['Order_status'] = 'Paid'
                }
                o['Metodo_de_Pago'] = payment
                o['Client_name'] = client_name
                if (Status) {
                    if (Orders.find(ele => ele.Order_id === o.Order_id) !== undefined) {
                        returnProduct(return_val, false)
                        await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster/update', o)
                            .then(async (item) => {
                                var data_ord = []
                                for (var d = 0; d < details_data.length; d++) {
                                    if (details_data[d].Order_pro_id === undefined) {
                                        data_ord.push(details_data[d])
                                    }
                                }
                                await axios.post('https://storecontrolserverv2-production-3675.up.railway.app/orderproduct/new', data_ord)
                                    .then(async (item2) => {
                                        var items_order = details_data.filter(ele => ele.Order_pro_id !== undefined)
                                        for (var q = 0; q < item2.data.length; q++) {
                                            items_order.push(item2.data[q])
                                        }
                                        setDetailsData(items_order)
                                        for (let i = 0; i < data_ord.length; i++) {
                                            var stock = Products.filter((p) => p.Product_id === data_ord[i].Product_id)[0].Stock
                                            var total_stock = stock[data_ord[i].parentArray][data_ord[i].childArray] - data_ord[i].Qty
                                            stock[data_ord[i].parentArray][data_ord[i].childArray] = total_stock
                                            var req_data = {
                                                Product_id: data_ord[i].Product_id,
                                                Stock: JSON.stringify(stock)
                                            }

                                            delete data_ord[i].Order_id
                                            var pro_index = Products.findIndex(x => x.Product_id === data_ord[i].Product_id)
                                            Products[pro_index].Stock = stock
                                            allproduct(Products)
                                            if (window.desktop) {
                                                await window.api.addData(Products, "Products")
                                            }

                                            await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/quantity', req_data)
                                            await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster')
                                                .then(async prod => {
                                                    prod.data.sort(function (d1, d2) {
                                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                                    });
                                                    allorders(prod.data)
                                                    setOrder_Data([prod.data.find(ele => ele.Order_id === order.Order_id)])
                                                    // console.log('PayOrder', prod.data.find(ele => ele.Order_id === order.Order_id).order_product)
                                                    // setDetailsData(prod.data.find(ele => ele.Order_id === order.Order_id).order_product)
                                                    // console.log(items_order?.reduce((acc, value )=> acc + value.Total_price, 0), items_order)
                                                    setOrderReturn({
                                                        ...order,
                                                        order_product: items_order,
                                                        Total_price: items_order?.reduce((acc, value )=> acc + value.Total_price, 0)
                                                    })
                                                    if (window.desktop) {
                                                        await window.api.addData(prod.data, "Orders")
                                                    }
                                                    var da = new Date()
                                                    var year = da.getFullYear()
                                                    var month = da.getMonth()
                                                    var date = da.getDate()
                                                    var tot = 0
                                                    for (var q = 0; q < prod.data.length; q++) {
                                                        if (new Date(prod.data[q].createdAt).toDateString() === new Date().toDateString()) {
                                                            tot = prod.data[q].Total_price + tot
                                                        }
                                                    }
                                                    var index = Sales_Activity.findIndex(item => item.year === year)
                                                    if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                        for (var w = 0; w < Sales_Activity.length; w++) {
                                                            for (var e = 0; e < months_data.length; e++) {
                                                                Sales_Activity[w][months_data[e]] = JSON.parse(Sales_Activity[w][months_data[e]])
                                                            }
                                                        }
                                                    }
                                                    Sales_Activity[index][months_data[month]][date - 1].sales = tot
                                                    for (var t = 0; t < Sales_Activity.length; t++) {
                                                        for (var m = 0; m < months_data.length; m++) {
                                                            Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
                                                        }
                                                    }
                                                    await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity/day', {
                                                        Sales_id: Sales_Activity[index].Sales_id,
                                                        ...Sales_Activity[index]
                                                    })
                                                    await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity')
                                                        .then(async item => {
                                                            if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                                for (var t = 0; t < item.data.length; t++) {
                                                                    for (var m = 0; m < months_data.length; m++) {
                                                                        item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
                                                                    }
                                                                }
                                                            }
                                                            allsalesactivity(item.data)
                                                        })
                                                })
                                        }
                                    })
                            })
                    } else {
                        await axios.post('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster/new', o)
                            .then(async (item) => {
                                for (let i = 0; i < details_data.length; i++) {
                                    details_data[i].Order_id = item.data.Order_id
                                }
                                await axios.post('https://storecontrolserverv2-production-3675.up.railway.app/orderproduct/new', details_data)
                                    .then(async (item2) => {
                                        for (let i = 0; i < details_data.length; i++) {
                                            var stock = Products.filter((p) => p.Product_id === details_data[i].Product_id)[0].Stock
                                            var total_stock = stock[details_data[i].parentArray][details_data[i].childArray] - details_data[i].Qty
                                            stock[details_data[i].parentArray][details_data[i].childArray] = total_stock
                                            var req_data = {
                                                Product_id: details_data[i].Product_id,
                                                Stock: JSON.stringify(stock)
                                            }

                                            delete details_data[i].Order_id
                                            var pro_index = Products.findIndex(x => x.Product_id === details_data[i].Product_id)
                                            Products[pro_index].Stock = stock
                                            allproduct(Products)
                                            if (window.desktop) {
                                                await window.api.addData(Products, "Products")
                                            }

                                            await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/quantity', req_data)
                                            await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster')
                                                .then(async prod => {
                                                    prod.data.sort(function (d1, d2) {
                                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                                    });
                                                    allorders(prod.data)
                                                    if (window.desktop) {
                                                        await window.api.addData(prod.data, "Orders")
                                                    }
                                                    var d = new Date()
                                                    var year = d.getFullYear()
                                                    var month = d.getMonth()
                                                    var date = d.getDate()
                                                    var tot = 0
                                                    for (var q = 0; q < prod.data.length; q++) {
                                                        if (new Date(prod.data[q].createdAt).toDateString() === new Date().toDateString()) {
                                                            tot = prod.data[q].Total_price + tot
                                                        }
                                                    }
                                                    var index = Sales_Activity.findIndex(item => item.year === year)
                                                    if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                        for (var w = 0; w < Sales_Activity.length; w++) {
                                                            for (var e = 0; e < months_data.length; e++) {
                                                                Sales_Activity[w][months_data[e]] = JSON.parse(Sales_Activity[w][months_data[e]])
                                                            }
                                                        }
                                                    }
                                                    Sales_Activity[index][months_data[month]][date - 1].sales = tot
                                                    for (var t = 0; t < Sales_Activity.length; t++) {
                                                        for (var m = 0; m < months_data.length; m++) {
                                                            Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
                                                        }
                                                    }
                                                    await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity/day', {
                                                        Sales_id: Sales_Activity[index].Sales_id,
                                                        ...Sales_Activity[index]
                                                    })
                                                    await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity')
                                                        .then(async item => {
                                                            if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                                for (var t = 0; t < item.data.length; t++) {
                                                                    for (var m = 0; m < months_data.length; m++) {
                                                                        item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
                                                                    }
                                                                }
                                                            }
                                                            allsalesactivity(item.data)
                                                        })
                                                })
                                        }
                                    })
                                //-----------------Notification---------------------
                                for (let i = 0; i < details_data.length; i++) {
                                    var code = Products?.filter((p) => p.Product_id === details_data[i]?.Product_id)[0]
                                    for (var c = 0; c < code.codigo.length; c++) {
                                        var index_code = code.codigo[c].findIndex(s => s === details_data[i].code)
                                        if (index_code !== -1) {
                                            var nombre = code.nombre
                                            var Stock = code.Stock[c][index_code]
                                            var Color = code.Color[c]
                                            var Size = code.Size[c][index_code]
                                            if (Stock <= 3) {
                                                axios.post("https://storecontrolserverv2-production-3675.up.railway.app/notification/new", {
                                                    Title: Stock === 0 ? 'Stock danger' : Stock <= 3 ? 'Stock warning' : null,
                                                    Message: Stock === 0 ? `El producto de ${nombre} (${Color}, ${Size}) se agoto. cargue mas stock !` : Stock <= 3 ? `El producto de ${nombre} (${Color}, ${Size}) se esta apunto de acabar. cargue mas stock !` : null,
                                                    Date: new Date().toLocaleString("en-US")
                                                }).then((item) => {
                                                    var note = Notific
                                                    note.push(item.data)
                                                    note.sort(function (d1, d2) {
                                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                                    });
                                                    notify(note);
                                                }).catch((err) => { console.log(err) })
                                            }
                                        }
                                    }
                                }
                            })
                    }
                } else {
                    // console.log(o)
                    // console.log(details_data)
                    var final_order = {
                        ...o,
                        order_product: details_data
                    }
                    // console.log(final_order)
                    var or = Orders
                    or.push(final_order)
                    or.sort(function (d1, d2) {
                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                    });
                    // console.log(or)
                    allorders(or)
                    if (window.desktop) {
                        await window.api.addData(or, "Orders")
                    }
                    for (let i = 0; i < details_data.length; i++) {
                        delete details_data[i].Order_id
                        var produ = Products.map(item => {
                            if (item.Product_id === details_data[i].Product_id) {
                                var stock = Products.filter((p) => p.Product_id === details_data[i].Product_id)[0].Stock
                                var total_stock = stock[details_data[i].parentArray][details_data[i].childArray] - details_data[i].Qty
                                stock[details_data[i].parentArray][details_data[i].childArray] = total_stock
                                return {
                                    ...item,
                                    Stock: stock
                                }
                            } else {
                                return item
                            }
                        })
                        allproduct(produ)
                        if (window.desktop) {
                            await window.api.addData(produ, "Products")
                        }
                    }
                    for (let i = 0; i < details_data.length; i++) {
                        var code = Products?.filter((p) => p.Product_id === details_data[i]?.Product_id)[0]
                        for (let c = 0; c < code.codigo.length; c++) {
                            var index_code = code.codigo[c].findIndex(s => s === details_data[i].code)
                            if (index_code !== -1) {
                                var nombre = code.nombre
                                var Stock = code.Stock[c][index_code]
                                var Color = code.Color[c]
                                var Size = code.Size[c][index_code]
                                if (Stock <= 3) {
                                    var note = await window.api.getAllData("Notification").then((item) => item.Notification)
                                    var msg = {
                                        Title: Stock === 0 ? 'Stock danger' : Stock <= 3 ? 'Stock warning' : null,
                                        Message: Stock === 0 ? `El producto de ${nombre} (${Color}, ${Size}) se agoto. cargue mas stock !` : Stock <= 3 ? `El producto de ${nombre} (${Color}, ${Size}) se esta apunto de acabar. cargue mas stock !` : null,
                                        Date: new Date().toLocaleString("en-US"),
                                        createdAt: new Date().toISOString()
                                    }
                                    note.push(msg)
                                    note.sort(function (d1, d2) {
                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                    });
                                    notify(note);
                                    if (window.desktop) {
                                        await window.api.addData(note, "Notification")
                                    }
                                }
                            }
                        }
                    }
                }
                setClientName('')
                setPayment(null)
                setDetailsData(null)
                setOrder(null)
                if (setReturnedData !== null) {
                    setReturnedData(null)
                }
            }
        } else {
            if (client_name === '') {
                setErrorMsg(true)
            } else {
                let o = order
                if (val) {
                    o['Order_status'] = 'Paid'
                }
                // o['Metodo_de_Pago'] = payment
                o['Client_name'] = client_name
                if (Status) {
                    if (Orders.find(ele => ele.Order_id === o.Order_id) !== undefined) {
                        await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster/update', o)
                            .then(async (item) => {
                                var data_ord = []
                                for (var d = 0; d < details_data.length; d++) {
                                    if (details_data[d].Order_pro_id === undefined) {
                                        data_ord.push(details_data[d])
                                    }
                                }
                                await axios.post('https://storecontrolserverv2-production-3675.up.railway.app/orderproduct/new', data_ord)
                                    .then(async (item2) => {
                                        var items_order = details_data.filter(ele => ele.Order_pro_id !== undefined)
                                        for (var q = 0; q < item2.data.length; q++) {
                                            items_order.push(item2.data[q])
                                        }
                                        setDetailsData(items_order)
                                        for (let i = 0; i < data_ord.length; i++) {
                                            var stock = Products.filter((p) => p.Product_id === data_ord[i].Product_id)[0].Stock
                                            var total_stock = stock[data_ord[i].parentArray][data_ord[i].childArray] - data_ord[i].Qty
                                            stock[data_ord[i].parentArray][data_ord[i].childArray] = total_stock
                                            var req_data = {
                                                Product_id: data_ord[i].Product_id,
                                                Stock: JSON.stringify(stock)
                                            }

                                            delete data_ord[i].Order_id
                                            var pro_index = Products.findIndex(x => x.Product_id === data_ord[i].Product_id)
                                            Products[pro_index].Stock = stock
                                            allproduct(Products)
                                            if (window.desktop) {
                                                await window.api.addData(Products, "Products")
                                            }

                                            await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/quantity', req_data)
                                            await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster')
                                                .then(async prod => {
                                                    prod.data.sort(function (d1, d2) {
                                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                                    });
                                                    allorders(prod.data)
                                                    setOrder_Data([prod.data.find(ele => ele.Order_id === order.Order_id)])
                                                    // console.log('PayOrder', prod.data.find(ele => ele.Order_id === order.Order_id).order_product)
                                                    // setDetailsData(prod.data.find(ele => ele.Order_id === order.Order_id).order_product)
                                                    setOrderReturn({
                                                        ...order,
                                                        order_product: items_order,
                                                        Total_price: items_order?.reduce((acc, value )=> acc + value.Total_price, 0)
                                                    })
                                                    if (window.desktop) {
                                                        await window.api.addData(prod.data, "Orders")
                                                    }
                                                    var da = new Date()
                                                    var year = da.getFullYear()
                                                    var month = da.getMonth()
                                                    var date = da.getDate()
                                                    var tot = 0
                                                    for (var q = 0; q < prod.data.length; q++) {
                                                        if (new Date(prod.data[q].createdAt).toDateString() === new Date().toDateString()) {
                                                            tot = prod.data[q].Total_price + tot
                                                        }
                                                    }
                                                    var index = Sales_Activity.findIndex(item => item.year === year)
                                                    if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                        for (var w = 0; w < Sales_Activity.length; w++) {
                                                            for (var e = 0; e < months_data.length; e++) {
                                                                Sales_Activity[w][months_data[e]] = JSON.parse(Sales_Activity[w][months_data[e]])
                                                            }
                                                        }
                                                    }
                                                    Sales_Activity[index][months_data[month]][date - 1].sales = tot
                                                    for (var t = 0; t < Sales_Activity.length; t++) {
                                                        for (var m = 0; m < months_data.length; m++) {
                                                            Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
                                                        }
                                                    }
                                                    await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity/day', {
                                                        Sales_id: Sales_Activity[index].Sales_id,
                                                        ...Sales_Activity[index]
                                                    })
                                                    await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity')
                                                        .then(async item => {
                                                            if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                                for (var t = 0; t < item.data.length; t++) {
                                                                    for (var m = 0; m < months_data.length; m++) {
                                                                        item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
                                                                    }
                                                                }
                                                            }
                                                            allsalesactivity(item.data)
                                                        })
                                                })
                                        }
                                    })
                            })
                    } else {
                        await axios.post('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster/new', o)
                            .then(async (item) => {
                                for (let i = 0; i < details_data.length; i++) {
                                    details_data[i].Order_id = item.data.Order_id
                                }
                                await axios.post('https://storecontrolserverv2-production-3675.up.railway.app/orderproduct/new', details_data)
                                    .then(async (item2) => {
                                        for (let i = 0; i < details_data.length; i++) {
                                            var stock = Products.filter((p) => p.Product_id === details_data[i].Product_id)[0].Stock
                                            var total_stock = stock[details_data[i].parentArray][details_data[i].childArray] - details_data[i].Qty
                                            stock[details_data[i].parentArray][details_data[i].childArray] = total_stock
                                            var req_data = {
                                                Product_id: details_data[i].Product_id,
                                                Stock: JSON.stringify(stock)
                                            }

                                            await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/quantity', req_data)
                                            await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster')
                                                .then(async prod => {
                                                    prod.data.sort(function (d1, d2) {
                                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                                    });
                                                    allorders(prod.data)
                                                    if (window.desktop) {
                                                        await window.api.addData(prod.data, "Orders")
                                                    }
                                                    var d = new Date()
                                                    var year = d.getFullYear()
                                                    var month = d.getMonth()
                                                    var date = d.getDate()
                                                    var tot = 0
                                                    for (var q = 0; q < prod.data.length; q++) {
                                                        if (new Date(prod.data[q].createdAt).toDateString() === new Date().toDateString()) {
                                                            tot = prod.data[q].Total_price + tot
                                                        }
                                                    }
                                                    var index = Sales_Activity.findIndex(item => item.year === year)
                                                    if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                        for (var w = 0; w < Sales_Activity.length; w++) {
                                                            for (var e = 0; e < months_data.length; e++) {
                                                                Sales_Activity[w][months_data[e]] = JSON.parse(Sales_Activity[w][months_data[e]])
                                                            }
                                                        }
                                                    }
                                                    Sales_Activity[index][months_data[month]][date - 1].sales = tot
                                                    for (var t = 0; t < Sales_Activity.length; t++) {
                                                        for (var m = 0; m < months_data.length; m++) {
                                                            Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
                                                        }
                                                    }
                                                    await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity/day', {
                                                        Sales_id: Sales_Activity[index].Sales_id,
                                                        ...Sales_Activity[index]
                                                    })
                                                    await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity')
                                                        .then(async item => {
                                                            if (typeof Sales_Activity[index][months_data[month]] === 'string') {
                                                                for (var t = 0; t < item.data.length; t++) {
                                                                    for (var m = 0; m < months_data.length; m++) {
                                                                        item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
                                                                    }
                                                                }
                                                            }
                                                            allsalesactivity(item.data)
                                                        })
                                                })
                                        }
                                    })
                                //-----------------Notification---------------------
                                for (let i = 0; i < details_data.length; i++) {
                                    var code = Products?.filter((p) => p.Product_id === details_data[i]?.Product_id)[0]
                                    for (var c = 0; c < code.codigo.length; c++) {
                                        var index_code = code.codigo[c].findIndex(s => s === details_data[i].code)
                                        if (index_code !== -1) {
                                            var nombre = code.nombre
                                            var Stock = code.Stock[c][index_code]
                                            var Color = code.Color[c]
                                            var Size = code.Size[c][index_code]
                                            if (Stock <= 3) {
                                                axios.post("https://storecontrolserverv2-production-3675.up.railway.app/notification/new", {
                                                    Title: Stock === 0 ? 'Stock danger' : Stock <= 3 ? 'Stock warning' : null,
                                                    Message: Stock === 0 ? `El producto de ${nombre} (${Color}, ${Size}) se agoto. cargue mas stock !` : Stock <= 3 ? `El producto de ${nombre} (${Color}, ${Size}) se esta apunto de acabar. cargue mas stock !` : null,
                                                    Date: new Date().toLocaleString("en-US")
                                                }).then((item) => {
                                                    var note = Notific
                                                    note.push(item.data)
                                                    note.sort(function (d1, d2) {
                                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                                    });
                                                    notify(note);
                                                }).catch((err) => { console.log(err) })
                                            }
                                        }
                                    }
                                }
                            })
                    }
                } else {
                    // console.log(o)
                    // console.log(details_data)
                    var final_order2 = {
                        ...o,
                        order_product: details_data
                    }
                    // console.log(final_order)
                    var or2 = Orders
                    or2.push(final_order2)
                    or2.sort(function (d1, d2) {
                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                    });
                    allorders(or2)
                    if (window.desktop) {
                        await window.api.addData(or2, "Orders")
                    }
                    for (let i = 0; i < details_data.length; i++) {
                        delete details_data[i].Order_id
                        var produ2 = Products.map(item => {
                            if (item.Product_id === details_data[i].Product_id) {
                                var stock = Products.filter((p) => p.Product_id === details_data[i].Product_id)[0].Stock
                                var total_stock = stock[details_data[i].parentArray][details_data[i].childArray] - details_data[i].Qty
                                stock[details_data[i].parentArray][details_data[i].childArray] = total_stock
                                return {
                                    ...item,
                                    Stock: stock
                                }
                            } else {
                                return item
                            }
                        })
                        allproduct(produ2)
                        if (window.desktop) {
                            await window.api.addData(produ2, "Products")
                        }
                    }
                    for (let i = 0; i < details_data.length; i++) {
                        var code2 = Products?.filter((p) => p.Product_id === details_data[i]?.Product_id)[0]
                        for (var c = 0; c < code2.codigo.length; c++) {
                            var index_code2 = code2.codigo[c].findIndex(s => s === details_data[i].code2)
                            if (index_code2 !== -1) {
                                var nombre2 = code2.nombre
                                var Stock2 = code2.Stock[c][index_code2]
                                var Color2 = code2.Color[c]
                                var Size2 = code2.Size[c][index_code2]
                                if (Stock2 <= 3) {
                                    var note2 = await window.api.getAllData("Notification").then((item) => item.Notification)
                                    var msg2 = {
                                        Title: Stock2 === 0 ? 'Stock danger' : Stock2 <= 3 ? 'Stock warning' : null,
                                        Message: Stock2 === 0 ? `El producto de ${nombre2} (${Color2}, ${Size2}) se agoto. cargue mas stock !` : Stock2 <= 3 ? `El producto de ${nombre2} (${Color2}, ${Size2}) se esta apunto de acabar. cargue mas stock !` : null,
                                        Date: new Date().toLocaleString("en-US")
                                    }
                                    note2.push(msg2)
                                    note2.sort(function (d1, d2) {
                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                    });
                                    notify(note2);
                                    if (window.desktop) {
                                        await window.api.addData(note2, "Notification")
                                    }
                                }
                            }
                        }
                    }
                }
                setClientName('')
                setPayment(null)
                setDetailsData(null)
                setOrder(null)
                if (setReturnedData !== null) {
                    setReturnedData(null)
                }
            }
        }
    }

    const settingval = (name, val) => {
        setClientName(val)
    };

    return (
        <div className='payorder'>
            <div className="modal fade" id="payorder" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Metodo de Pago</h5>
                            <button type="button" className="close" data-toggle="modal" data-target="#payorder" aria-label="Close">
                                <span aria-hidden="true"><FontAwesomeIcon icon="close" /></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='container-fluid'>
                                <div className="row">
                                    <div className="col-12">
                                        {
                                            order?.Client_name
                                            ? <>
                                                <span style={{ fontSize: 20, fontWeight: 600 }}>Cliente</span>:
                                                <span style={{ fontSize: 20, fontWeight: 600 }}>{order.Client_name}</span>
                                            </>
                                            : <div className="row">
                                                <div className='col-md-6 order_client my-1'>
                                                    <Dropdown name='Cliente' onChange={settingval} dropvalues={Clients?.map((item) => item.nombre)} />
                                                </div>
                                                <div className="col-md-6 btn_new_user">
                                                    <button
                                                        type="button"
                                                        className="btn_color"
                                                        data-toggle="modal"
                                                        data-target="#new_client"
                                                    // onClick={() => setModalShow(true)}
                                                    >
                                                        Registrar cliente
                                                    </button>
                                                </div>
                                            </div>
                                        }

                                        {/*   <div className='order_client my-1'>
                                            <span>Nombre Cliente: </span>
                                            {
                                                order?.Metodo_de_Pago !== undefined
                                                ? <span>{order.Client_name}</span>
                                                : <input 
                                                    type='text' 
                                                    placeholder='Nombre Cliente' 
                                                    className='input_box' 
                                                    value={client_name} 
                                                    onChange={(e) => {
                                                        setErrorMsg(false)
                                                        setClientName(e.target.value)
                                                    }} 
                                                />
                                            }
                                            {errormsg ? <div><span style={{color: 'red', fontSize: 18}}>Required</span></div> : null}
                                        </div> */}

                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md d-flex flex-column justify-content-center align-items-center'>
                                        <label className="form-check-label d-flex flex-column justify-content-center align-items-center" htmlFor="card">
                                            <div>
                                                <FontAwesomeIcon icon="credit-card" fontSize={60} color='blue' />
                                            </div>
                                            <div>
                                                <span style={{ fontSize: 20 }}>Pago con Tarjeta</span>
                                            </div>
                                            <input className="form-check-input" type="radio" name="payment" value='Pago con Tarjeta' id="card" onChange={onChange} checked={payment === 'Pago con Tarjeta'} />
                                        </label>
                                    </div>
                                    <div className='col-md d-flex flex-column justify-content-center align-items-center'>
                                        <label className="form-check-label d-flex flex-column justify-content-center align-items-center" htmlFor="cash">
                                            <div>
                                                <FontAwesomeIcon icon="money-bill-1-wave" fontSize={60} color='green' />
                                            </div>
                                            <div>
                                                <span style={{ fontSize: 20 }}>Pago con Efectivo</span>
                                            </div>
                                            <input className="form-check-input" type="radio" name="payment" value='Pago con Efectivo' id="cash" onChange={onChange} checked={payment === 'Pago con Efectivo'} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {payerr ? <div><span style={{ color: 'red', fontSize: 18 }}>Select Atleast one Option</span></div> : null}
                        </div>
                        <div className="modal-footer">
                            <div className='container-fluid m-0'>
                                <div className='row'>
                                    <div className='col p-0'>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            data-dismiss={client_name === '' ? null : "modal"}
                                            onClick={(e) => createOrder(e, false)}
                                        >A cobrar</button>
                                    </div>
                                    <div className='col p-0'>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            data-dismiss={client_name === '' || payment === null ? null : "modal"}
                                            onClick={(e) => createOrder(e, true)}
                                        >Pagado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NewClient allClients={Clients} setProvince={setProvince} Province={Province} depositVal={JSON.parse(localStorage.getItem('DepositoLogin')).Deposito_id} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Sales_Activity: state.Sales_Activity,
        Notific: state.NotifyMaster,
        Status: state.Status,
        Orders: state.Orders,
        Clients: state.Clients,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allClients: (val) => {
            dispatch({
                type: "CLIENTS",
                item: val,
            });
        },
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
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
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayOrder);

import axios from "axios";

// prettier-ignore
let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
// prettier-ignore
export const store_SalesActivity = async (naming, Status, Sales_Activity, allsalesactivity) => {
    if(Sales_Activity.length === 0) {
        if(Status) {
            // https://storecontrolserver-production-3675.up.railway./app
            await axios.get('http://localhost:5000/salesactivity')
                .then(async item => {
                    console.log(`${naming} -> Sales Activity`)
                    var log = JSON.parse(localStorage.getItem('DepositoLogin'))
                    var main_data = item.data
                    var con = {}
                    if(log.Type === 'Store') {
                        con = item.data.find(element => element.year === new Date().getFullYear() && log.Deposito_id_fk === element.Deposito_id)
                    } else {
                        con = item.data.find(element => element.year === new Date().getFullYear() && log.Deposito_id === element.Deposito_id)
                    }
                    if(con === undefined && (log.Type === 'Manager' || log.Type === 'Master Manager')) {
                        var single_month = {}
                        for(var i = 1; i <= months_data.length; i++) {
                            var single_date = []
                            var days = new Date(new Date().getFullYear(), i, 0).getDate()
                            for(var j = 1; j <= days; j++) {
                                var d = {
                                    id: j,
                                    day: j,
                                    sales: 0
                                }
                                single_date.push(d)
                            }
                            single_month[months_data[i-1]] = JSON.stringify(single_date)
                        }
                        var data = {
                            year: new Date().getFullYear(),
                            Deposito_id: log.Deposito_id,
                            ...single_month 
                        }
                        main_data = data
                        await axios.post('http://localhost:5000/salesactivity/new', data)
                        for(var t=0; t < main_data.length; t++) {
                            for(var m=0; m < months_data.length; m++) {
                                main_data[t][months_data[m]] = JSON.parse(main_data[t][months_data[m]])
                            }
                        }
                        allsalesactivity(main_data)
                        if(window.desktop) {
                            await window.api.addData(main_data, "Sales_Activity")
                            await window.api.getAllData("Sales_Activity").then(async (item2) => {
                                if(item2.Sales_Activity === undefined) {
                                } else {
                                    allsalesactivity(item2.Sales_Activity)
                                    var another_data = item2.Sales_Activity
                                    for(var q=0; q < another_data.length; q++) {
                                        for(var r=0; r < months_data.length; r++) {
                                            another_data[q][months_data[r]] = JSON.stringify(another_data[q][months_data[r]])
                                        }
                                    }
                                    await axios.post('http://localhost:5000/salesactivity/new', another_data[another_data.length - 1])
                                }
                            })
                        }
                    } else {
                        if(log.Type === 'Master Manager') {
                            for(var q=0; q<item.data.length; q++) {
                                for(var w=0; w < months_data.length; w++) {
                                    if(typeof item.data[q][months_data[w]] === 'string') item.data[q][months_data[w]] = JSON.parse(item.data[q][months_data[w]])
                                    if(typeof con[months_data[w]] === 'string') con[months_data[w]] = JSON.parse(con[months_data[w]])
                                    for(var tq=0; tq < item.data[q][months_data[w]].length; tq++) {
                                        var final_sale = item.data[q][months_data[w]][tq].sales + con[months_data[w]][tq].sales
                                        con[months_data[w]][tq].sales = final_sale
                                    }
                                }
                            }
                        } else {
                            for(var r=0; r < months_data.length; r++) {
                                con[months_data[r]] = JSON.parse(con[months_data[r]])
                            }
                        }
                        allsalesactivity(con)
                        if(window.desktop) {
                            await window.api.addData(con, "Sales_Activity")
                        }
                    }
                })
        } else {
            if(window.desktop) {
                await window.api.getAllData("Sales_Activity").then(async (item) => {
                    if(item.Sales_Activity === undefined) {
                        var log = JSON.parse(localStorage.getItem('DepositoLogin'))
                        var main_data = []
                        var single_month = {}
                        for(var i = 1; i <= months_data.length; i++) {
                            var single_date = []
                            var days = new Date(new Date().getFullYear(), i, 0).getDate()
                            for(var j = 1; j <= days; j++) {
                                var d = {
                                    id: j,
                                    day: j,
                                    sales: 0
                                }
                                single_date.push(d)
                            }
                            single_month[months_data[i-1]] = JSON.stringify(single_date)
                        }
                        var data = {
                            year: new Date().getFullYear(),
                            Deposito_id: log.Deposito_id,
                            ...single_month 
                        }
                        main_data.push(data)
                        allsalesactivity(main_data)
                        if(window.desktop) {
                            await window.api.addData(main_data, "Sales_Activity")
                        }
                    } else {
                        allsalesactivity(item.Sales_Activity)
                    }
                });
            }
        }
    }
};

// prettier-ignore
export const store_Products = async (naming, Status, Products, allproduct, setAllPro, Sales_Activity, allorders, allsalesactivity, CategoryAdd=null, filtered_cat=null) => {
    if(Products.length === 0) {
        if(Status) {
            await axios.get("http://localhost:5000/product").then(async (item) => {
                var dep = JSON.parse(localStorage.getItem("DepositoLogin"))
                console.log(`${naming} -> Products`)
                var alldata = item.data
                if (alldata.length > 0) {
                    if (typeof alldata[0].Color === 'string') {
                        for (var i = 0; i < alldata.length; i++) {
                            alldata[i].codigo = JSON.parse(alldata[i].codigo)
                            alldata[i].Color = JSON.parse(alldata[i].Color)
                            alldata[i].Size = JSON.parse(alldata[i].Size)
                            alldata[i].Stock = JSON.parse(alldata[i].Stock)
                            alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
                            alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
                            alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
                            alldata[i].Image = JSON.parse(alldata[i].Image)
                        }
                    }
                }
                alldata.sort(function (d1, d2) {
                    return new Date(d1.createdAt) - new Date(d2.createdAt);
                });
                if(filtered_cat !== null) {
                    if(CategoryAdd.length === 0) {
                        await axios.get("http://localhost:5000/category").then(async (category_data) => {
                            filtered_cat(category_data.data?.filter(cat => alldata.filter(pro => pro.Category_id === cat.Category_id)[0]?.Category_id).map((final) => final.nombre))
                        })
                    } else {
                        filtered_cat(CategoryAdd?.filter(cat => alldata.filter(pro => pro.Category_id === cat.Category_id)[0]?.Category_id).map((final) => final.nombre))
                    }
                }
                if(dep.Type === "Manager") {
                    alldata = alldata.filter(ele => ele.Deposito_id === dep.Deposito_id)
                }
                setAllPro(alldata)
                allproduct(alldata);
                // await window.api.addData(alldata, "Products")
                if(window.desktop) {
                    await window.api.getAllData("Products").then(async (item2) => {
                        await window.api.getAllData("Orders_Returns").then(async (order_ret) => {
                            if(order_ret.Orders_Returns) {
                                // console.log(order_ret.Orders_Returns)
                                order_ret.Orders_Returns.forEach(async (ret) => {
                                    await axios.put('http://localhost:5000/product/quantity', {Product_id: ret.Product_id, Stock: ret.Stock})
                                    var new_data = alldata.findIndex(p => p.Product_id === ret.Product_id)
                                    alldata[new_data].Stock = JSON.parse(ret.Stock)
                                    setAllPro(alldata)
                                    allproduct(alldata)
                                    console.log(ret)
                                    if(ret.del) {
                                        await axios.delete(`http://localhost:5000/ordermaster/delete/${ret.order.Order_id}`)
                                    } else {
                                        await axios.put(`http://localhost:5000/ordermaster/price`, {
                                            Order_id: ret.order.Order_id,
                                            Total_price: ret.order.Total_price
                                        })
                                    }
                                    await axios.delete(`http://localhost:5000/orderproduct/delete/${ret.val.Order_pro_id}`)
                                    .then(async item => {
                                        await axios.get('http://localhost:5000/ordermaster')
                                            .then(async prod => {
                                                let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                                prod.data.sort(function (d1, d2) {
                                                    return new Date(d2.createdAt) - new Date(d1.createdAt);
                                                });
                                                allorders(prod.data)
                                                await window.api.addData(prod.data, "Orders")
                                                var year = new Date(ret.order.createdAt).getFullYear()
                                                var month = new Date(ret.order.createdAt).getMonth()
                                                var date = new Date(ret.order.createdAt).getDate()
                                                var tot = 0
                                                for(var q=0; q<prod.data.length; q++) {
                                                    if(new Date(prod.data[q].createdAt).toDateString() === new Date(ret.order.createdAt).toDateString()) {
                                                        tot = prod.data[q].Total_price + tot
                                                    }
                                                }
                                                var Sales_data = {}
                                                if(Sales_Activity.length === 0) {
                                                    if(item2.Sales_Activity.length >= 0) {
                                                        var index2 = item2.Sales_Activity.findIndex(item => item.year === year)
                                                        Sales_data = item2.Sales_Activity[index2]
                                                    } else {
                                                        Sales_data = item2.Sales_Activity
                                                    }
                                                } else {
                                                    var index = Sales_Activity.findIndex(item => item.year === year)
                                                    console.log(Sales_Activity, Sales_Activity[index])
                                                    Sales_data = Sales_Activity[index]
                                                }
                                                console.log(Sales_data, tot)
                                                Sales_data[months_data[month]][date-1].sales = tot
                                                for(var m=0; m < months_data.length; m++) {
                                                    Sales_data[months_data[m]] = JSON.stringify(Sales_data[months_data[m]])
                                                }
                                                await axios.put('http://localhost:5000/salesactivity/day', {
                                                    Sales_id: Sales_data.Sales_id,
                                                    ...Sales_data
                                                })
                                                await axios.get('http://localhost:5000/salesactivity').then(async item3 => {
                                                    for(var t=0; t < item3.data.length; t++) {
                                                        for(var m=0; m < months_data.length; m++) {
                                                            item3.data[t][months_data[m]] = JSON.parse(item3.data[t][months_data[m]])
                                                        }
                                                    }
                                                    allsalesactivity(item3.data)
                                                    if(window.desktop) {
                                                        await window.api.addData(item3.data, "Sales_Activity")
                                                    }
                                                })
                                            })
                                    })
                                })
                            }
                        })
                        item2.Products.forEach(async function (pro, index) {
                            // console.log('pro', pro)
                            var find_pro = alldata.find(al => al.Product_id === pro.Product_id)
                            var flag4 = 0
                            if(find_pro) {
                                if(pro.Stock.length === find_pro.Stock.length && 
                                    pro.description === find_pro.description && 
                                    pro.nombre === find_pro.nombre && 
                                    pro.Category_id === find_pro.Category_id) {
                                    for(var i=0; i < pro.Stock.length; i++) {
                                        if(pro.Stock[i].length !== find_pro.Stock[i].length ) {
                                            flag4 = 1
                                            break
                                        }
                                        for(var j=0; j < pro.Stock[i].length; j++) {
                                            if(pro.Size[i][j] !== find_pro.Size[i][j] ||
                                                pro.Stock[i][j] !== find_pro.Stock[i][j] ||
                                                pro.precioVenta[i][j] !== find_pro.precioVenta[i][j] ||
                                                pro.costoCompra[i][j] !== find_pro.costoCompra[i][j] ||
                                                pro.costoMenor[i][j] !== find_pro.costoMenor[i][j]) {
                                                flag4 = 1
                                                break
                                            }
                                        }
                                    }
                                } else {
                                    flag4 = 1
                                }
                            }
                            if (!Object.keys(pro).includes('createdAt')) {
                                console.log('First')
                                var dep = pro.deposito
                                delete pro.deposito
                                var convert_data = {
                                    ...pro,
                                    codigo: JSON.stringify(pro.codigo),
                                    Color: JSON.stringify(pro.Color),
                                    Size: JSON.stringify(pro.Size),
                                    Stock: JSON.stringify(pro.Stock),
                                    precioVenta: JSON.stringify(pro.precioVenta),
                                    costoCompra: JSON.stringify(pro.costoCompra),
                                    costoMenor: JSON.stringify(pro.costoMenor),
                                    Image: JSON.stringify(pro.Image),
                                }
                                console.log(convert_data)
                                await axios.post("http://localhost:5000/product/new", convert_data).then(async (item) => {
                                    item.data.codigo = JSON.parse(item.data.codigo);
                                    item.data.Color = JSON.parse(item.data.Color);
                                    item.data.Size = JSON.parse(item.data.Size);
                                    item.data.Stock = JSON.parse(item.data.Stock);
                                    item.data.precioVenta = JSON.parse(item.data.precioVenta);
                                    item.data.costoCompra = JSON.parse(item.data.costoCompra);
                                    item.data.costoMenor = JSON.parse(item.data.costoMenor);
                                    item.data.deposito = dep
                                    item.data.Image = JSON.parse(item.data.Image);

                                    var m = alldata;
                                    m.push(item.data);
                                    // console.log(m)
                                    setAllPro(m);
                                    allproduct(m);
                                    if (window.desktop) {
                                        await window.api.addData(m, "Products");
                                    }
                                });
                            } else if (flag4 === 1) {
                                var edit_val = {
                                    Product_id: pro.Product_id,
                                    nombre: pro.nombre,
                                    codigo: JSON.stringify(pro.codigo),
                                    description: pro.description,
                                    Image: JSON.stringify(pro.Image),
                                    Color: JSON.stringify(pro.Color),
                                    Size: JSON.stringify(pro.Size),
                                    Stock: JSON.stringify(pro.Stock),
                                    precioVenta: JSON.stringify(pro.precioVenta),
                                    costoCompra: JSON.stringify(pro.costoCompra),
                                    costoMenor: JSON.stringify(pro.costoMenor),
                                    Deposito: pro.Deposito_id,
                                    deposito: pro.deposito.nombre,
                                    Category_id: pro.Category_id,
                                };
                                // console.log(edit_val);

                                await axios.put('http://localhost:5000/product/edit', edit_val).then(res => {
                                    console.log(res.data, 'its here')
                                })
                                await axios.get("http://localhost:5000/product").then(async (item) => {
                                    console.log(`${naming} -> Update`)
                                    var alldata2 = item.data
                                    if (alldata2.length > 0) {
                                        if (typeof alldata2[0].Color === 'string') {
                                            for (var i = 0; i < alldata2.length; i++) {
                                                alldata2[i].codigo = JSON.parse(alldata2[i].codigo)
                                                alldata2[i].Color = JSON.parse(alldata2[i].Color)
                                                alldata2[i].Size = JSON.parse(alldata2[i].Size)
                                                alldata2[i].Stock = JSON.parse(alldata2[i].Stock)
                                                alldata2[i].precioVenta = JSON.parse(alldata2[i].precioVenta)
                                                alldata2[i].costoCompra = JSON.parse(alldata2[i].costoCompra)
                                                alldata2[i].costoMenor = JSON.parse(alldata2[i].costoMenor)
                                                alldata2[i].Image = JSON.parse(alldata2[i].Image)
                                            }
                                        }
                                    }
                                    alldata2.sort(function (d1, d2) {
                                        return new Date(d1.createdAt) - new Date(d2.createdAt);
                                    });
                                    setAllPro(alldata2)
                                    allproduct(alldata2);
                                    if (window.desktop) {
                                        await window.api.addData(alldata2, "Products");
                                    }
                                });
                            }
                            // console.log(item)
                        });
                        await window.api.getAllData("Products_Returns").then(async (product_ret) => {
                            if(product_ret.Products_Returns) {
                                // console.log(product_ret.Products_Returns)
                                product_ret.Products_Returns.forEach(async (ret) => {
                                    await axios.delete(`http://localhost:5000/product/delete/${ret.Product_id}`);
                                    await axios.get("http://localhost:5000/product").then(async (item) => {
                                        console.log(`${naming} -> Delete`)
                                        var alldata = item.data
                                        if (alldata.length > 0) {
                                            if (typeof alldata[0].Color === 'string') {
                                                for (var i = 0; i < alldata.length; i++) {
                                                    alldata[i].codigo = JSON.parse(alldata[i].codigo)
                                                    alldata[i].Color = JSON.parse(alldata[i].Color)
                                                    alldata[i].Size = JSON.parse(alldata[i].Size)
                                                    alldata[i].Stock = JSON.parse(alldata[i].Stock)
                                                    alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
                                                    alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
                                                    alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
                                                    alldata[i].Image = JSON.parse(alldata[i].Image)
                                                }
                                            }
                                        }
                                        alldata.sort(function (d1, d2) {
                                            return new Date(d1.createdAt) - new Date(d2.createdAt);
                                        });
                                        setAllPro(alldata)
                                        allproduct(alldata);
                                        if (window.desktop) {
                                            await window.api.addData(alldata, "Products");
                                        }
                                    });
                                })
                            }
                        })
                        // console.log(alldata.length, item2.Products.length)

                        // if(alldata.length > item2.Products.length) {
                        //     for (var h = 0; h < alldata.length; h++) {
                        //         var flag = 0
                        //         for (var v = 0; v < item2.Products.length; v++) {
                        //             if (alldata[h].Product_id === item2.Products[v].Product_id) {
                        //                 flag = 1
                        //                 break
                        //             }
                        //         }
                        //         if (flag === 0) {
                        //             await axios.delete(`http://localhost:5000/product/delete/${alldata[h].Product_id}`);
                        //             await axios.get("http://localhost:5000/product").then(async (item) => {
                        //                 console.log(`${naming} -> Delete`)
                        //                 var alldata = item.data
                        //                 if (alldata.length > 0) {
                        //                     if (typeof alldata[0].Color === 'string') {
                        //                         for (var i = 0; i < alldata.length; i++) {
                        //                             alldata[i].codigo = JSON.parse(alldata[i].codigo)
                        //                             alldata[i].Color = JSON.parse(alldata[i].Color)
                        //                             alldata[i].Size = JSON.parse(alldata[i].Size)
                        //                             alldata[i].Stock = JSON.parse(alldata[i].Stock)
                        //                             alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
                        //                             alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
                        //                             alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
                        //                             alldata[i].Image = JSON.parse(alldata[i].Image)
                        //                         }
                        //                     }
                        //                 }
                        //                 alldata.sort(function (d1, d2) {
                        //                     return new Date(d1.createdAt) - new Date(d2.createdAt);
                        //                 });
                        //                 setAllPro(alldata)
                        //                 allproduct(alldata);
                        //                 if (window.desktop) {
                        //                     await window.api.addData(alldata, "Products");
                        //                 }
                        //             });
                        //         }
                        //     }
                        // }

                    });
                    await window.api.addData(alldata, "Products")
                    await window.api.deleteData("Products_Returns")
                    await window.api.deleteData("Orders_Returns")
                }
            })
        } else {
            if (window.desktop) {
                await window.api.getAllData("Products").then((item) => {
                    allproduct(item.Products)
                    setAllPro(item.Products)
                });
            }
        }
    }
}

// prettier-ignore
export const store_Category = async (naming, Status, CategoryAdd, category) => {
    if(CategoryAdd.length === 0) {
        if(Status) {
            await axios.get("http://localhost:5000/category").then(async (item) => {
                console.log(`${naming} -> Category`)
                category(item.data);
                if(window.desktop) {
                    await window.api.getAllData("CategoryAdd").then(async (item2) => {
                        item2.CategoryAdd.forEach(async function (cate) {
                            if (!Object.keys(cate).includes('createdAt')) {
                                await axios.post('http://localhost:5000/category/new', cate).then(async (item3) => {
                                        console.log(`${naming} -> Category Inserted`)
                                        category(item3.data)
                                        var da = item.data
                                        da.push(item3.data)
                                        // console.log(da)
                                        await window.api.addData(da, "CategoryAdd")
                                        return
                                    })
                            }
                        })
                        // console.log(item.data.length, item2.CategoryAdd.length)
                        // if(item.data.length < item2.CategoryAdd.length) {
                        //     item.data.forEach(async function(c) {
                        //         var flaging = 0
                        //         for(var k=0; k < item2.CategoryAdd.length; k++) {
                        //             if(c.Category_id === item2.CategoryAdd[k].Category_id) {
                        //                 flaging = 1
                        //                 break
                        //             }
                        //         }
                        //         if(flaging === 0) {
                        //             console.log(`${naming} -> Category Delete`)
                        //             await axios.delete(`http://localhost:5000/category/delete/${c.Category_id}`)
                        //             var filter = item.data.filter(item => item.Category_id !== c.Category_id)
                        //             await window.api.addData(filter, "CategoryAdd")
                        //             category(filter)
                        //             return
                        //         }
                        //     })
                        // }
                        // console.log(item2)
                    });
                    await window.api.getAllData("Category_Returns").then(async (category_ret) => {
                        if(category_ret.Category_Returns) {
                            category_ret.Category_Returns.forEach(async (ret) => {
                                await axios.delete(`http://localhost:5000/category/delete/${ret.Category_id}`)
                                var filter = item.data.filter(item => item.Category_id !== ret.Category_id)
                                await window.api.addData(filter, "CategoryAdd")
                                category(filter)
                            })
                        }
                    })
                    await window.api.deleteData("Category_Returns")
                    await window.api.addData(item.data, "CategoryAdd")
                }
            })
        } else {
            if (window.desktop) {
                await window.api.getAllData("CategoryAdd").then((item) => {
                    category(item.CategoryAdd)
                });
            }
        }
    }
}

// prettier-ignore
export const store_Desposito = async (naming, Status, DepositoAdd, deposito) => {
    if (DepositoAdd.length === 0) {
        if (Status) {
            await axios.get("http://localhost:5000/deposito").then(async (item) => {
                console.log(`${naming} -> Deposito`)
                item.data.sort(function (d1, d2) {
                    return new Date(d2.createdAt) - new Date(d1.createdAt);
                });
                deposito(item.data);
                if (window.desktop) {
                    await window.api.addData(item.data, "Deposito")
                }
            })
        } else {
            if (window.desktop) {
                await window.api.getAllData("Deposito").then((item) => deposito(item.Deposito));
            }
        }
    }
}

// prettier-ignore
export const store_Orders = async (naming, Status, Orders, allorders, notify) => {
    if(Orders.length === 0) {
        if(Status) {
            await axios.get('http://localhost:5000/ordermaster')
            .then(async (item) => {
                    console.log(`${naming} -> Orders`)
                    item.data.sort(function (d1, d2) {
                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                    });
                    allorders(item.data)
                    if(window.desktop) {
                        var flag = 0
                        await window.api.getAllData("Orders").then((item) => {
                            item.Orders.forEach(async function (ord, index) {
                                if(!Object.keys(ord).includes("Order_id")) {
                                    flag = 1
                                    return
                                }
                            })
                        });
                        if(flag === 0) {
                            // console.log('There is no values to save')
                            await window.api.addData(item.data, "Orders")
                        }
                    }
                })
        } else {
            if(window.desktop) {
                await window.api.getAllData("Orders").then((item) => {
                    item.Orders.sort(function (d1, d2) {
                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                    });
                    allorders(item.Orders)
                });
                await window.api.getAllData("Notification").then((item) => notify(item.Notification))
            }
        }
    }
}

// prettier-ignore
export const store_Expenses = async (naming, Status, Expenses, allexp) => {
    if(Expenses.length === 0){
        if(Status) {
            await axios.get("http://localhost:5000/expense").then(async (item) => {
                console.log(`${naming} -> all expenses`)
                // setallDataExp(item.data)
                var DepositoLogin = JSON.parse(localStorage.getItem('DepositoLogin'))
                var deposit_client = item.data.filter(ele => ele.Deposito_id === DepositoLogin.Deposito_id)
                deposit_client.sort(function (d1, d2) {
                    return new Date(d2.createdAt) - new Date(d1.createdAt);
                });
                allexp(deposit_client)
                if(window.desktop) {
                    await window.api.getAllData("Expenses").then(async (item2) => {
                        item2.Expenses.forEach(async function (exp, index) {
                            if(!Object.keys(exp).includes('ExpenseId')) {
                                await axios.post("http://localhost:5000/expense/new", exp)
                                .then(async (item3) => {
                                    var m = deposit_client;
                                    m.push(item3.data);
                                    m.sort(function (d1, d2) {
                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                    });
                                    allexp(m);
                                    await window.api.addData(m, "Expenses")
                                    // console.log(allExpenses, 'details')
                                }).catch(err => console.log(err))
                            }
                            if(deposit_client.length === item2.Expenses.length) {
                                item2.Expenses.forEach(async (new_exp) => {
                                    var find_exp = deposit_client.find(al => al.ExpenseId === new_exp.ExpenseId)
                                    var flag1 = 0
                                    if(find_exp) {
                                        if(find_exp.date !== new_exp.date ||
                                            find_exp.Total !== new_exp.Total ||
                                            find_exp.Description !== new_exp.Description ||
                                            find_exp.PayMethod !== new_exp.PayMethod ||
                                            find_exp.CategoryExpense_id !== new_exp.CategoryExpense_id) {
                                                flag1 = 1
                                        }
                                    }
                                    if(flag1 === 1) {
                                        // console.log('Should Update Expense', new_exp)
                                        await axios.put("http://localhost:5000/expense/edit", new_exp).catch(err => console.log(err))
                                        await axios.get("http://localhost:5000/expense").then(async (item3) => {
                                            // var exp_new = Expenses.map(exp => exp.ExpenseId === new_exp.ExpenseId ? new_exp : exp)
                                            var deposit_client2 = item3.data.filter(ele => ele.Deposito_id === DepositoLogin.Deposito_id)
                                            deposit_client2.sort(function (d1, d2) {
                                                return new Date(d2.createdAt) - new Date(d1.createdAt);
                                            });
                                            allexp(deposit_client2)
                                            // setAllExpenses(item3.data)
                                            await window.api.addData(deposit_client2, "Expenses")
                                            // console.log('succes update front ')
                                        })
                                    }
                                })
                            }
                            // console.log(exp)
                            // if(item.data.length < item2.Expenses.length) {
                            //     item.data.forEach(async function(ex) {
                            //         var flag = 0
                            //         for(var v=0; v<item2.Expenses.length; v++) {
                            //             // console.log(item.data[h].ExpenseId, item2.Expenses[v].ExpenseId)
                            //             if(ex.ExpenseId === item2.Expenses[v].ExpenseId) {
                            //                 flag = 1
                            //                 break
                            //             }
                            //         }
                            //         if(flag === 0) {
                            //             // console.log('Should Delete Expense')
                            //             await axios.delete(`http://localhost:5000/expense/delete/${ex.ExpenseId}`).then(async dele => {
                            //                 await axios.get("http://localhost:5000/expense").then(async (item7) => {
                            //                     item7.data.sort(function (d1, d2) {
                            //                         return new Date(d2.createdAt) - new Date(d1.createdAt);
                            //                     });
                            //                     allexp(item7.data)
                            //                     // setAllExpenses(item7.data)
                            //                     await window.api.addData(item7.data, "Expenses")
                            //                 })
                            //             })
                            //         }
                            //     })
                            // } 
                        })
                    });
                    await window.api.getAllData("Expenses_Returns").then(async (expense_ret) => {
                        if(expense_ret.Expenses_Returns) {
                            expense_ret.Expenses_Returns.forEach(async (ret) => {
                                await axios.delete(`http://localhost:5000/expense/delete/${ret.Expense_id}`).then(async dele => {
                                    await axios.get("http://localhost:5000/expense").then(async (item7) => {
                                        var deposit_client3 = item7.data.filter(ele => ele.Deposito_id === DepositoLogin.Deposito_id)
                                        deposit_client3.sort(function (d1, d2) {
                                            return new Date(d2.createdAt) - new Date(d1.createdAt);
                                        });
                                        allexp(deposit_client3)
                                        // setAllExpenses(item7.data)
                                        await window.api.addData(deposit_client3, "Expenses")
                                    })
                                })
                            })
                        }
                    })
                    await window.api.deleteData("Expenses_Returns")
                    await window.api.addData(deposit_client, "Expenses")
                }
            })
        } else {
            if(window.desktop) {
                await window.api.getAllData("Expenses").then((item) => allexp(item.Expenses));
            }
        }
    }
}

// prettier-ignore
export const store_Expensecat = async (naming, Status, Expensecat, expense_category) => {
    if (Expensecat.length === 0) {
        if(Status) {
            await axios.get("http://localhost:5000/expensecat").then(async (item) => {
                console.log(`${naming} -> ExpenseCat`) 		
                expense_category(item.data)
                if(window.desktop) {
                    await window.api.getAllData("Expensecat").then(async (item2) => {
                        item2.Expensecat.forEach(async function (exp_cate, index) {
                            if(!Object.keys(exp_cate).includes('CategoryExpense_id')) {
                                await axios.post("http://localhost:5000/expensecat/new", exp_cate).then(async (item3) => {
                                    console.log(`${naming} -> new expensecate`)
                                    expense_category(item3.data);
                                    var da_cate = item.data
                                    da_cate.push(item3.data)
                                    await window.api.addData(da_cate, "Expensecat")
                                    // return
                                }).catch(err => console.log(err))
                            }
                        })
                    });
                    await window.api.addData(item.data, "Expensecat")
                }
            })
        } else {
            if(window.desktop) {
                await window.api.getAllData("Expensecat").then((item) => expense_category(item.Expensecat));
            }
        }
    }
}

// prettier-ignore
export const store_NotifyMaster = async (naming, Status, Notific, notify) => {
    if(Notific.length === 0){
        if(Status) {
            await axios.get("http://localhost:5000/notification").then(async item => {
                console.log(`${naming} -> Notification`)
                item.data.sort(function (d1, d2) {
                    return new Date(d2.createdAt) - new Date(d1.createdAt);
                });
                notify(item.data)
                if(window.desktop) {
                    await window.api.getAllData("Notification").then(async (item2) => {
                        item2.Notification.forEach(async notify_data => {
                            if(notify_data.Notify_id === undefined) {
                                await axios.post("http://localhost:5000/notification/new",{
                                    Title: notify_data.Title,
                                    Message:  notify_data.Message,
                                    Date: notify_data.Date
                                }).then(async n => {
                                    console.log(`${naming} -> Inserted`)
                                    var note = item.data
                                    note.push(n.data)
                                    // console.log(note)
                                    note.sort(function (d1, d2) {
                                        return new Date(d2.createdAt) - new Date(d1.createdAt);
                                    });
                                    notify(note);
                                    if(window.desktop) {
                                        await window.api.addData(note, "Notification")
                                    }
                                }).catch((err) => { console.log(err) })
                            }
                        })
                    });
                    await window.api.addData(item.data, "Notification")
                }
            })
        } else {
            if(window.desktop) {
                await window.api.getAllData("Notification").then((item) => notify(item.Notification));
            }
        }
    }
}

// prettier-ignore
export const store_Clients = async (naming, Status, Clients, allClients, allprovince) => {
    if(Clients.length === 0) {
        if(Status) {
            await axios.get("http://localhost:5000/register").then((response) => {
                console.log(`${naming} -> Clients`)
				allClients(response.data)
            })
        }
    }
}

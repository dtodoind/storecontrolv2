import React, { useEffect, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import { connect } from "react-redux";
import "./Users.scss";
import axios from "axios";
import NewClient from "../../Components/NewClient/NewClient";
import { store_Desposito, store_Category, store_Products, store_Orders, store_Clients } from "../../Functions/AllFunctions";
import ClientEdit from "../../Components/ClientEdit/ClientEdit";
import PayOrder from "./../../Components/PayOrder/PayOrder";

// prettier-ignore
function Users(props) {

    const { allClients, Clients, CategoryAdd, category, Products, Deposito, deposito, Status, allproduct, Sales_Activity, allsalesactivity, allorders, Orders, notify, filtered_cat } = props
    
    const [Province, setProvince] = useState();
    const [, setAllPro] = useState(Products);
    const[currentUser, setCurrentUser]=useState()
    const loop = useRef(true)

    const editRow =(user)=>{
        setCurrentUser(user)
    }

    if (localStorage.getItem('DepositoLogin') !== null) {
        var deposit = JSON.parse(localStorage.getItem('DepositoLogin')).Deposito_id;

    }

    useEffect(() => {
        async function dep_method() {
            await store_Desposito('Users', Status, Deposito, deposito)
            await store_Category('Users', Status, CategoryAdd, category)
            await store_Products('Users', Status, Products, allproduct, setAllPro, Sales_Activity, allorders, allsalesactivity, CategoryAdd, filtered_cat)
            await store_Orders('Users', Status, Orders, allorders, notify)
			await store_Clients('Users', Status, Clients, allClients)
        }

        if (loop.current) {
            dep_method()
            loop.current = false
        }
        if (Status && window.desktop) {
            window.api.getAllData("Clients_Returns").then(async (client_ret) => {
                if (client_ret.Expenses_Returns) {
                    client_ret.Expenses_Returns.forEach(async (ret) => {
                        await axios.delete(`http://localhost:5000/register/delete/${ret.id}`).then(async dele => {
                            await axios.get("http://localhost:5000/register").then(async (item7) => {

                                allClients(item7.data)
                                // setAllExpenses(item7.data)
                                await window.api.addData(item7.data, "Clients")
                            })
                        })
                    })
                }
            })
            window.api.deleteData("Clients_Returns")
        }

        // window.api.addData(item.data,"Users")

        /*      axios.delete(`http://localhost:5000/register/delete/${id}`).then( dele => {
               axios.get("http://localhost:5000/register").then( (response) => {
                  
                     allClients(response.data)
              
                  window.api.addData(response.data, "Clients")
                 }) 
             }) */
    }, [CategoryAdd, Deposito, Orders, Products, Sales_Activity, Status, allClients, allorders, allproduct, allsalesactivity, category, deposito, notify, Clients, filtered_cat])

    const removeClient = async (id) => {
        if (Status) {
            await axios.delete(`http://localhost:5000/register/delete/${id}`);
            var e = Clients.filter(function (x) { return x.id !== id })
            allClients(e)
        } else {
            if (window.desktop) {
                var e2 = Clients.filter(function (x) { return x.id !== id })
                await window.api.addData(e2, "Clients")
                var cli_ret2 = []
                await window.api.getAllData('Clients_Returns').then(async retur => {
                    // console.log(return_ord.Orders_Returns)
                    if (retur.Clients_Returns) {
                        cli_ret2 = retur.Clients_Returns
                    }
                    var extra = {
                        id: id,
                    }
                    cli_ret2.push(extra)
                    // console.log(ord_ret)
                    await window.api.addData(cli_ret2, "Clients_Returns")
                })
            }
        }
    }

    return (
        <div className="users">
            <div className="btn_new_user">
                <button
                    type="button"
                    className="btn_color"
                    data-toggle="modal"
                    data-target="#new_client"
                // onClick={() => setModalShow(true)}
                >
                    Registrar cliente
                </button>

                <div className='table_overflow'>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col" className='text-center'>ID</th>
                                <th scope="col" className='text-center'>Nombre</th>
                                <th scope="col" className='text-center'>Deposito</th>
                                <th scope="col" className='text-center'>Celular</th>
                                <th scope="col" className='text-center'>Provincia</th>
                                <th scope="col" className='text-center'>Pais</th>
                                <th scope="col" className='text-center'>Eliminar</th>
                                <th scope="col" className='text-center'>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Clients?.map((i, key) => (
                                    <tr key={key} >
                                        <th scope="row" className='text-center align-middle'>{key + 1}</th>
                                        <td className='text-center align-middle'>{i.nombre}</td>
                                        <td className='text-center align-middle'>{Deposito.length !== 0 && i.Deposito_id !== null ? Deposito?.find(ele => ele.Deposito_id === i.Deposito_id).nombre : null}</td>
                                        <td className='text-center align-middle'>{i.number} </td>
                                        <td className='text-center align-middle'>{i.Provincia}</td>
                                        <td className='text-center align-middle'>{i.Country}</td>
                                        <td className='edit text-center align-middle'>
                                            <IoCloseCircle style={{ display: "inline" }} className="close_icon_ind" onClick={() => removeClient(i.id)} />
                                        </td>
                                        <td className='edit text-center align-middle'>
                                            <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" data-toggle="modal"
                                                data-target="#client_edit"  onClick={() => editRow(i)}/>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <NewClient allClients={Clients} depositVal={deposit} />
            <ClientEdit Province={Province} setCurrentUser={setCurrentUser} currentUser={currentUser} />
            <PayOrder allClients={Clients}  Province={Province} setProvince={setProvince} depositVal={deposit} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Orders: state.Orders,
        CategoryAdd: state.CategoryAdd,
        Deposito: state.Deposito,
        Status: state.Status,
        Sales_Activity: state.Sales_Activity,
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
        deposito: (val) => {
            dispatch({
                type: "DEPOSITO",
                item: val,
            });
        },
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
        category: (val) => {
            dispatch({
                type: "CATEGORYADD",
                item: val,
            });
        },
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
        filtered_cat: (val) => {
            dispatch({
                type: "FILTERED_CAT",
                item: val,
            });
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Users);

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuidv4 } from "uuid";

import "./Dropdown.scss";
import axios from "axios";
import { connect } from "react-redux";
// prettier-ignore
function Dropdown({ name, dropvalues, onChange, touched, errors, value_select, inputbox=false, ...props }) {

    const { CategoryAdd, category, deposito, DepositoLog, Expensecat, allexpensecat, Status, DepositoAdd, Filtered_cat } = props
    
    const [selected, setSelected] = useState(value_select === '' ? name === 'manager' ? 'Manager' : 'Select' : value_select)
    const [inputText, setInputText] = useState('')
    const [open, setOpen] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function selecting() {
            setSelected(value_select === '' ? name === 'manager' ? 'Manager' : 'Select' : value_select)
        }
        selecting()
    }, [value_select, CategoryAdd, name])

    const dropingdown = () => {
        document.getElementById(name).classList.toggle('drop_show')
        var wid = document.getElementById(name+'1').clientWidth
        document.getElementById(name).style.width = wid+'px'
        setOpen(!open)
    }

    const input_submit = async (e, name) => {
        e.preventDefault()
        if(name === 'Category_id') {
            if(Status) {
                await axios.post('http://localhost:5000/category/new', { Category_id: uuidv4(), nombre: inputText})
                    .then(async (item) => {
                        category(item.data)
                        var cate = CategoryAdd
                        cate.push(item.data)
                        if(window.desktop) {
                            await window.api.addData(cate, "CategoryAdd")
                        }
                        setInputText('')
                    })
            } else {
                var input_name = {
                    Category_id: uuidv4(),
                    nombre: inputText
                }
                var cate = CategoryAdd
                cate.push(input_name)
                category(cate)
                dropvalues.push(inputText)
                if(window.desktop) {
                    await window.api.addData(cate, "CategoryAdd")
                }
                setInputText('')
            }
        } else if(name === 'Nombre Vendedor :') {
            var DepositoLogin = JSON.parse(localStorage.getItem('DepositoLogin'))
            var deposit = DepositoAdd.filter(item => item.nombre === inputText || item.Deposito_id === DepositoLogin.Deposito_id)
            if(deposit.length >= 2 ) {
                setError(`${inputText} is a Deposit name`)
            } else {
                deposit = deposit[0]
                var de = JSON.parse(deposit.Employee_list)
                if(de.includes(inputText)) {
                    setError(`${inputText} is a Employee name`)
                } else {
                    de.push(inputText)
                    await axios.put('http://localhost:5000/deposito/employee', { Deposito_id: deposit.Deposito_id,  Employee_list: JSON.stringify(de)})
                        .then(async (item) => {
                            // console.log(de)
                            var dep = {
                                Deposito_id: deposit.Deposito_id,
                                nombre: deposit.nombre,
                                Email: deposit.Email,
                                Employee_list: JSON.stringify(de),
                                Type: deposit.Type,
                                Deposito_id_fk: deposit.Deposito_id_fk,
                                Password: deposit.Password,
                                createdAt: deposit.createdAt,
                                updatedAt: deposit.updatedAt
                            }
                            localStorage.setItem('DepositoLogin', JSON.stringify(dep))
                            DepositoLog(dep)
                            await axios.get('http://localhost:5000/deposito')
                                .then(item => {
                                    deposito(item.data)
                                    setInputText('')
                                })
                        })
                    setError('')
                }
            }
        }
        else if(name==="Expense_cat" || name==="Expense_cate"){
            if(Status) {
                await axios.post('http://localhost:5000/expensecat/new', {nombre: inputText}).then(async (item)=>{
                    allexpensecat(item.data)
                    var exp_cate = Expensecat
                    exp_cate.push(item.data)
                    if(window.desktop) {
                        await window.api.addData(exp_cate, "Expensecat")
                    }
                    setInputText('')
                })
            } else {
                var input_exp = {
                    nombre: inputText
                }
                var expcate = Expensecat
                expcate.push(input_exp)
                allexpensecat(expcate)
                dropvalues.push(inputText)
                console.log(expcate)
                if(window.desktop) {
                    await window.api.addData(expcate, "Expensecat")
                }
                setInputText('')
            }
        }
        // else if(name === 'Deposito') {
        //     await axios.post('http://localhost:5000/deposito/new', { nombre: inputText})
        //         .then((item) => {
        //             deposito(item.data)
        //             setInputText('')
        //         })
        // }
    }

    const category_remove = async (cate, index) => {
        var filtered = CategoryAdd.filter(function(el, i) { return index !== i; });
        category(filtered)
        if(Status) {
            await axios.delete(`http://localhost:5000/category/delete/${CategoryAdd.filter(function(el, i) { return index === i; })[0].Category_id}`)
        } else {
            if(window.desktop) {
                await window.api.addData(filtered, "CategoryAdd")
                var cate_ret2 = []
                await window.api.getAllData('Category_Returns').then(async return_cate => {
                    // console.log(return_ord.Orders_Returns)
                    if(return_cate.Category_Returns) {
                        cate_ret2 = return_cate.Category_Returns
                    }
                    var extra = {
                        Category_id: CategoryAdd.filter(function(el, i) { return index === i; })[0].Category_id,
                    }
                    cate_ret2.push(extra)
                    // console.log(ord_ret)
                    await window.api.addData(cate_ret2, "Category_Returns")
                })
            }
        }
    }

    return (
        <div className='whole_drop' style={name === 'manager' ? {width: '270px', marginBottom: '20px'} : null}>
            <div className={`${name === 'Nombre Vendedor :' ? null : 'container-fluid'} ${name === 'manager' ? 'p-0' : ''}`}>
                <div className='row'>
                    {
                        name === 'manager'
                        ? null
                        : <div className={`${name === 'Nombre Vendedor :' ? 'col-6' : 'col-4'} d-flex align-items-center`}>
                            <span style={{fontWeight: name === 'Nombre Vendedor :' ? '500' : '700'}}>
                                {
                                    name === 'not_nombre'
                                    ? 'Nombre'
                                    : name.charAt(0).toUpperCase() + name.slice(1)
                                }
                            </span>
                        </div>
                    }
                    <div className={`${name === 'Nombre Vendedor :' ? 'col-6' : name === 'manager' ? 'col-12' : 'col-8'}`}>
                        <div className="dropdown_select">
                            <button type='button' className='select_value' style={name === 'manager' ? {padding: '10px 20px', backgroundColor: 'rgba(0,0,0,0.5)', border: 0} : null} id={name+'1'} onChange={onChange} onClick={dropingdown}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    {
                                        name === 'manager'
                                        ? <div className="d-flex justify-content-between align-items-center">
                                            <FontAwesomeIcon icon="user-tie" style={{padding: 5, paddingRight: 10, color: name === 'manager' ? selected === 'Manager' ? 'gray' : 'white' : null}}/>
                                            <span style={{padding: 5, paddingLeft: 10, fontSize: name === 'Nombre Vendedor :' ? 15 : null, color: name === 'manager' ? selected === 'Manager' ? 'gray' : 'white' : null}}>{selected}</span>
                                        </div>
                                        : <span style={{padding: 5, paddingLeft: 10, fontSize: name === 'Nombre Vendedor :' ? 15 : null, color: name === 'manager' ? selected === 'Manager' ? 'gray' : 'white' : null}}>{selected}</span>                                        
                                    }
                                    {
                                        open
                                        ? <FontAwesomeIcon icon="angle-down" style={{padding: 5, paddingRight: 10, color: name === 'manager' ? selected === 'Manager' ? 'gray' : 'white' : null}}/>
                                        : <FontAwesomeIcon icon="angle-up" style={{padding: 5, paddingRight: 10, color: name === 'manager' ? selected === 'Manager' ? 'gray' : 'white' : null}}/>
                                    }
                                </div>
                            </button>
                            <div className='drop_down' id={name}>
                                {
                                    inputbox
                                    ? <div className="d-flex flex-column">
                                        <div className='input_main_box d-flex align-items-center w-100'>
                                            <div className='w-100 flex-1'>
                                                <input 
                                                    type='text' 
                                                    className='w-100 p-1 input_cat' 
                                                    value={inputText} 
                                                    onChange={(e) => {
                                                        setInputText(e.target.value)
                                                        setError('')
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <button type="button" className='btn' onClick={(e) => input_submit(e, name)}><FontAwesomeIcon icon="plus" /></button>
                                            </div>
                                        </div>
                                        {
                                            error !== ''
                                            ? <span style={{color: 'red', fontSize: 15}}>{error}</span>
                                            : null
                                        }
                                    </div>
                                    // ? <div className='container-fluid'>
                                    //     <div className='row d-flex align-items-center'>
                                    //         <div className='col-10 p-0'>
                                    //             <input type='text' className='w-100 p-1 input_cat' />
                                    //         </div>
                                    //         <div className='col-2 p-0'>
                                    //             <button className='btn btn-primary'><FontAwesomeIcon icon="plus" /></button>
                                    //         </div>
                                    //     </div>
                                    // </div>
                                    : null
                                }
                                {
                                    name === "Category_id"
                                    ? dropvalues?.map((item, index) => 
                                        item !== ""
                                        ? <div key={index} className="cate_option">
                                            <div name={item} 
                                                className="option flex-grow-1"
                                                onClick={() => {
                                                    setSelected(item)
                                                    onChange(name, item)
                                                    dropingdown()
                                                }}
                                            >
                                                {item}
                                            </div>
                                            {
                                                !Filtered_cat?.includes(item)
                                                ? <button type="button" className="minus_btn" onClick={() => category_remove(item, index)}>
                                                    <FontAwesomeIcon icon="minus" style={{padding: 5, paddingRight: 10, zIndex: 5}}/>
                                                </button>
                                                : null
                                            }
                                        </div>
                                        : null
                                    )
                                    : name === 'not_nombre'
                                        ? dropvalues?.map((item, index) => 
                                            item !== ""
                                            ? <div name={typeof item === 'string' ? item : item.nombre} 
                                                key={index} 
                                                className={item === null ? "" : "option"} 
                                                onClick={() => {
                                                    setSelected(typeof item === 'string' ? item : item.Deposito_id)
                                                    onChange(name, typeof item === 'string' ? item : item.nombre)
                                                    dropingdown()
                                                }}
                                            >{typeof item === 'string' ? item : item.nombre}</div>
                                            : null
                                        )
                                        : dropvalues?.map((item, index) => 
                                            item !== ""
                                            ? <div name={item} 
                                                key={index} 
                                                className={item === null ? "" : "option"} 
                                                onClick={() => {
                                                    setSelected(item)
                                                    onChange(name, item)
                                                    dropingdown()
                                                }}
                                            >{item}</div>
                                            : null
                                        )
                                }
                            </div>
                            {/* <select value={value_select === '' ? 'Select' : value_select} name={name} onChange={onChange}>
                                <option value='addvalue' data-toggle='show_agregar' data-target='#agregar'>Agregar {name}</option>
                                <option value='Select' disabled>Select</option>
                                {
                                    dropvalues.map((item, index) => 
                                        <option value={item} key={index}>{item}</option>
                                    )
                                }
                            </select>
                            <button type="button" className='btn' data-toggle='modal' data-target='#agregar'>
                                <FontAwesomeIcon icon="plus" />
                            </button> */}
                        </div>
                        {touched && errors ? <div className='error_display text-danger'>{errors}</div> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        Expensecat: state.Expensecat,
        DepositoAdd: state.Deposito,
        Filtered_cat: state.Filtered_cat,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        category: (val) => {
            dispatch({
                type: "CATEGORYADD",
                item: val,
            });
        },
        deposito: (val) => {
            dispatch({
                type: "DEPOSITO",
                item: val,
            });
        },
        allexpensecat: (val) => {
            dispatch({
                type: "EXPENSECAT",
                item: val,
            });
        },
        DepositoLog: (val) => {
            dispatch({
                type: "DEPOSITOLOGIN",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);

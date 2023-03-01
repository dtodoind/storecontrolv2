import React, { useRef, useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import "./TransferStock.scss";
import Dropdown from "../Dropdown/Dropdown";
import OneDetail from "../DetailsProduct/OneDetail";
import { connect } from "react-redux";

// prettier-ignore
function TransferStock({ details_data, stocknum, setAllPro, ...props }) {

    const { Status, Products, allproduct, Deposito } = props
    
    const [sizing, setSizing] = useState(null);
    const [preval, setPreVal] = useState(null);
    const [maxstock, setMaxStock] = useState(0);
    const [transferir_show, setTransferir_show] = useState(true)

    const formref = useRef();

    const validate = (values) => {
        const errors = {};

        if (parseInt(values.exhibit) === 1) {
            setTransferir_show(false)
        } else {
            setTransferir_show(true)
        }
        
        if(transferir_show) {
            if (!values.transferir) {
                errors.transferir = "Required";
            } else if (values.transferir === stocknum.deposito.nombre) {
                errors.transferir = "no se puede transferir a la misma tienda";
            }
        }

        if (!values.Stock) {
            errors.Stock = "Required";
        } else if (values.Stock > maxstock) {
            errors.Stock = `Solo quedan ${maxstock} en ${details_data?.deposito.nombre}`;
        }

        if (values.Color) {
            if (values.Color !== preval) {
                setPreVal(values.Color);
                formref.current.setFieldValue("Size", "");
                setSizing(details_data.Size[details_data?.Color.indexOf(values.Color)].map((size) => size));
            }
        }

        if (values.Size) {
            var ind = details_data.Size[details_data?.Color.indexOf(values.Color)].indexOf(values.Size);
            setMaxStock(details_data.Stock[details_data?.Color.indexOf(values.Color)][ind]);
        }

        if (!values.Color) errors.Color = "Required";
        if (!values.Size) errors.Size = "Required";

        return errors;
    };

    const initialValues = {
        exhibit: 0,
        transferir: "",
        Stock: "",
        Color: "",
        Size: "",
    };

    const onSubmit = async (values, { resetForm }) => {
        var product_one
        var pro
        var final_color = values.Color
        if(transferir_show) {
            product_one = Products.filter((item) => item.nombre === details_data?.nombre).filter(val => val.deposito.nombre === values.transferir)[0]
            pro = [...Products]
            if(product_one === undefined) {
                var inti = {
                    Product_id: uuidv4(),
                    nombre: details_data.nombre,
                    codigo: JSON.stringify([]),
                    description: details_data.description,
                    Image: JSON.stringify([]),
                    Color: JSON.stringify([]),
                    Size: JSON.stringify([]),
                    Stock: JSON.stringify([]),
                    precioVenta: JSON.stringify([]),
                    costoCompra: JSON.stringify([]),
                    costoMenor: JSON.stringify([]),
                    Category_id: details_data.Category_id,
                }
                if(Status) {
                    await axios.post("https://storecontrolserverv2-production-3675.up.railway.app/product/new", {
                            ...inti,
                            Deposito_id: Deposito.filter(item => item.nombre === values.transferir)[0].Deposito_id
                        })
                        .then(async (item) => {
                            item.data.codigo = JSON.parse(item.data.codigo);
                            item.data.Color = JSON.parse(item.data.Color);
                            item.data.Size = JSON.parse(item.data.Size);
                            item.data.Stock = JSON.parse(item.data.Stock);
                            item.data.precioVenta = JSON.parse(item.data.precioVenta);
                            item.data.costoCompra = JSON.parse(item.data.costoCompra);
                            item.data.costoMenor = JSON.parse(item.data.costoMenor);
                            item.data.deposito = Deposito.filter(item => item.nombre === values.transferir)[0]
                            item.data.Image = JSON.parse(item.data.Image);
            
                            allproduct(item.data);
                            var m = Products;
                            m.push(item.data);
                            setAllPro(m);
                            if(window.desktop) {
                                await window.api.addData(m, "Products");
                            }
                            // resetForm();
                        });
                } else {
                    var pro_data = {
                        ...inti,
                        codigo: JSON.parse(inti.codigo),
                        Color: JSON.parse(inti.Color),
                        Size: JSON.parse(inti.Size),
                        Stock: JSON.parse(inti.Stock),
                        precioVenta: JSON.parse(inti.precioVenta),
                        costoCompra: JSON.parse(inti.costoCompra),
                        costoMenor: JSON.parse(inti.costoMenor),
                        deposito: Deposito.filter(item => item.nombre === values.transferir)[0],
                        Image: JSON.parse(inti.Image),
                        Deposito_id: Deposito.filter(item => item.nombre === values.transferir)[0].Deposito_id
                    }
                    pro.push(pro_data)
                    console.log(pro)
                    Products.push(pro_data)
                    allproduct(pro)
                    setAllPro(pro);
                    if(window.desktop) {
                        await window.api.addData(pro, "Products");
                    }
                    // resetForm();
                }
            }
        } else {
            if(values.Color.split('(').length < 2) {
                final_color = values.Color+" (Exhibit)"
            } else {
                final_color = values.Color.split(' (')[0]
            }
            // product_one = Products.filter((item) => item.nombre === details_data?.nombre).filter(val => val.deposito.nombre === details_data.nombre)[0]
        }
        // console.log(Products.filter((item) => item.nombre === details_data?.nombre))
        var product_one2 = {}
        var colap = 0
        if(Status) {
            product_one2 = {}
            if(transferir_show) {
                product_one2 = Products.filter((item) => item.nombre === details_data?.nombre).filter(val => val.deposito.nombre === values.transferir)[0]
            } else {
                product_one2 = details_data
            }
            colap = Products.findIndex((item) => item.Product_id === undefined ? Products.length - 1  : item.Product_id === product_one2.Product_id)
        } else {
            product_one2 = {}
            if(transferir_show) {
                product_one2 = Products.filter((item) => item.nombre === details_data?.nombre).filter(val => val.deposito.nombre === values.transferir)[0]
            } else {
                product_one2 = details_data
            }
            colap = pro.findIndex((item) => item.Product_id === undefined ? Products.length - 1  : item.Product_id === product_one2.Product_id)
        }
        // console.log(Products[colap])
        // if(colap === null) colap = Products.length - 1 

        var i = details_data.Color.findIndex(item => values.Color === item)
        var j = details_data.Size[i].findIndex(item => item === values.Size)
        var inn = 0
        var ijj = 0

        if(!Products[colap].Color.includes(final_color)) {
            Products[colap].Color.push(final_color)
            Products[colap].Size.push([values.Size, ''])
            Products[colap].Stock.push([values.Stock])
            Products[colap].precioVenta.push([details_data.precioVenta[i][j]])
            Products[colap].costoCompra.push([details_data.costoCompra[i][j]])
            Products[colap].costoMenor.push([details_data.costoMenor[i][j]])
            Products[colap].codigo.push([details_data.codigo[i][j]])
            Products[colap].Image.push([])
        } else {
            inn = Products[colap].Color.findIndex(item => final_color === item)
            ijj = Products[colap].Size[inn].findIndex(item => values.Size === item)
            var next_val = Products[colap].Size[inn].length - 1
            if(!Products[colap].Size[inn].includes(values.Size)) {
                Products[colap].Size[inn].splice(next_val, 1, values.Size)
                Products[colap].Size[inn].push('')
                Products[colap].Stock[inn].push(values.Stock)
                Products[colap].precioVenta[inn].push(details_data.precioVenta[i][j])
                Products[colap].costoCompra[inn].push(details_data.costoCompra[i][j])
                Products[colap].costoMenor[inn].push(details_data.costoMenor[i][j])
                // Products[colap].codigo[inn].push(Math.random().toString(16).slice(2))
                Products[colap].codigo[inn].push(details_data.codigo[i][j])
            } else {
                var st = Products[colap].Stock[inn][ijj] !== undefined ? Products[colap].Stock[inn][ijj] + values.Stock : 0 + values.Stock
                Products[colap].Stock[inn].splice(ijj, 1, st)
            }
        }
        var minus = details_data?.Stock[i][j] - values.Stock
        details_data.Stock[i][j] = minus
        // delete details_data.createdAt
        // var index = Products.findIndex(item => item.Product_id === details_data?.Product_id)
        // Products[index] = details_data
        // console.log(details_data.Stock, Products[colap].Stock)
        var new_pro = Products.map(item => item.Product_id === details_data?.Product_id ? details_data : item);
        allproduct(new_pro)
        if(window.desktop) {
            await window.api.addData(new_pro, "Products");
        }
        
        var edit_val = {
            Product_id: Products[colap].Product_id,
            nombre: Products[colap].nombre,
            codigo: JSON.stringify(Products[colap].codigo),
            description: Products[colap].description,
            Image: JSON.stringify(Products[colap].Image),
            Color: JSON.stringify(Products[colap].Color),
            Size: JSON.stringify(Products[colap].Size),
            Stock: JSON.stringify(Products[colap].Stock),
            precioVenta: JSON.stringify(Products[colap].precioVenta),
            costoCompra: JSON.stringify(Products[colap].costoCompra),
            costoMenor: JSON.stringify(Products[colap].costoMenor),
            Deposito: Products[colap].Deposito_id,
            deposito: Products[colap].deposito.nombre,
            Category_id: Products[colap].Category_id,
        };
        var main_pro = {
            Product_id: details_data.Product_id,
            codigo: JSON.stringify(details_data.codigo),
            Size: JSON.stringify(details_data.Size),
            Stock: JSON.stringify(details_data.Stock),
            precioVenta: JSON.stringify(details_data.precioVenta),
            costoCompra: JSON.stringify(details_data.costoCompra),
            costoMenor: JSON.stringify(details_data.costoMenor),
        };
        // console.log(edit_val, main_pro)
        // console.log(Products)
        if(Status) {
            await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/edit', edit_val)
            await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/edit', main_pro)
        }
        // await axios.get("https://storecontrolserverv2-production-3675.up.railway.app/product").then((item) => {
        //     var alldata = item.data
        //     if(alldata.length > 0) {
        //         if(typeof alldata[0].Color === 'string') {
        //             for(var i=0; i<alldata.length; i++) {
        //                 alldata[i].codigo = JSON.parse(alldata[i].codigo)
        //                 alldata[i].Color = JSON.parse(alldata[i].Color)
        //                 alldata[i].Size = JSON.parse(alldata[i].Size)
        //                 alldata[i].Stock = JSON.parse(alldata[i].Stock)
        //                 alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
        //                 alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
        //                 alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
        //                 alldata[i].Image = JSON.parse(alldata[i].Image)
        //             }
        //         }
        //     }
        //     alldata.sort(function (d1, d2) {
        //         return new Date(d1.createdAt) - new Date(d2.createdAt);
        //     });
        //     console.log(alldata)
        //     allproduct(alldata);
        // })
        // alert(JSON.stringify(values, null, 2));
        resetForm();
    };

    const settingval = (name, val) => {
        formref.current.setFieldValue(name, val);
    };

    return (
        <div className="transferstock">
            <div
                className="modal fade"
                id="transferstock"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center">
                            <h3 className="modal-title" id="exampleModalLabel">
                                Transferir Stock
                            </h3>
                            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
                            </button> */}
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validate={validate}
                            onSubmit={onSubmit}
                            enableReinitialize={true}
                            innerRef={formref}
                        >
                            {(props) => (
                                <Form>
                                    <div className="modal-body">
                                        <div className="d-flex justify-content-around">
                                            <div>
                                                <input type="radio" id="notexhibit" name="exhibit" value={0} onChange={props.handleChange} defaultChecked={props.values.exhibit === 0} />
                                                <label htmlFor="notexhibit" style={{marginLeft: 5}}>Not Exhibit</label>
                                            </div>
                                            <div>
                                                <input type="radio" id="exhibit1" name="exhibit" value={1} onChange={props.handleChange} defaultChecked={props.values.exhibit !== 0} />
                                                <label htmlFor="exhibit1" style={{marginLeft: 5}}>Exhibit</label>
                                            </div>
                                        </div>
                                        <OneDetail
                                            name="Deposito"
                                            data={stocknum?.deposito.nombre}
                                        />
                                        {
                                            transferir_show
                                            ? <Dropdown
                                                name="transferir"
                                                // dropvalues={Products.filter((item) => item.nombre === details_data?.nombre).map(val => stocknum?.deposito.nombre === val.deposito.nombre ? null : val.deposito.nombre)}
                                                dropvalues={Deposito.map((d) => stocknum?.deposito.nombre === d.nombre || d.Type === 'Master Manager' ? null : d.nombre)}
                                                value_select={
                                                    props.values.transferir
                                                }
                                                onBlur={props.handleBlur}
                                                onChange={settingval}
                                                touched={props.touched.transferir}
                                                errors={props.errors.transferir}
                                            />
                                            : null
                                        }
                                        <Dropdown
                                            name="Color"
                                            dropvalues={details_data?.Color.map(
                                                (color) => color
                                            )}
                                            value_select={props.values.Color}
                                            onBlur={props.handleBlur}
                                            onChange={settingval}
                                            touched={props.touched.Color}
                                            errors={props.errors.Color}
                                        />
                                        <Dropdown
                                            name="Size"
                                            dropvalues={
                                                sizing === null ? [""] : sizing
                                            }
                                            value_select={props.values.Size}
                                            onBlur={props.handleBlur}
                                            onChange={settingval}
                                            touched={props.touched.Size}
                                            errors={props.errors.Size}
                                        />

                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-4 d-flex align-items-center py-3">
                                                    <span>Stock</span>
                                                </div>
                                                <div className="col-8 py-3">
                                                    <div className="input_price">
                                                        <Field
                                                            name="Stock"
                                                            type="number"
                                                            placeholder="Stock"
                                                        />
                                                    </div>
                                                    <div className="error_display text-danger">
                                                        <ErrorMessage name="Stock" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-dismiss="modal"
                                            onClick={() => {
                                                formref.current.setFieldValue("transferir", "");
                                                formref.current.setFieldValue("Stock", "");
                                                formref.current.setFieldValue("Color", "");
                                                formref.current.setFieldValue("Size", "");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Transfer
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Deposito: state.Deposito,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferStock);

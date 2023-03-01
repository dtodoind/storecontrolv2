import React, { useEffect, lazy, Suspense } from "react";
import "./App.scss";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import loader from "./assets/Loader.gif";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";
import EmployeeOrder from "./Pages/EmployeeOrder/EmployeeOrder";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";

const Login = lazy(() => import("./Pages/Login/Login"));
const Home = lazy(() => import("./Pages/Home/Home"));
const Products = lazy(() => import("./Pages/Products/Products"));
const Orders = lazy(() => import("./Pages/Orders/Orders"));
const Expenses = lazy(() => import("./Pages/Expenses/Expenses"));
const Tienda = lazy(() => import("./Pages/Tienda/Tienda"));
const Users = lazy(() => import("./Pages/Users/Users"));

// prettier-ignore
function App() {

	const toggle = () => {
		document.getElementById('sidebar').classList.toggle("activeing")
	}

	let navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('DepositoLogin') !== null) {
			var num = window.location.href.split('/').length - 1
            if(JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Manager' || JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Master Manager') {
                if(window.location.href.split('/')[num] === 'employeeorder' || window.location.href.split('/')[num] === '') {
                    navigate(-1)
                }
            } else {
				if(window.location.href.split('/')[num] !== 'employeeorder' || window.location.href.split('/')[num] === '') {
                    navigate(-1)
                }
			}
        }
    }, [navigate])

	return (
		<div className="App">
			<div className='wrapper_app'>
				{
					useLocation().pathname !== '/'
					? window.location.href.split('/')[window.location.href.split('/').length - 1] !== 'employeeorder'
						? <nav id="sidebar">
							<Sidebar toggle={toggle} />
						</nav>
						: null
					: null
				}
				<div id='content'>
					{
						useLocation().pathname !== '/'
						? <nav className='navbar navbar-light bg-light'>
							<Navbar toggle={toggle} />
						</nav>
						: null
					}
					<div className='main_display' 
						style={{
							height: window.location.href.split('/')[window.location.href.split('/').length - 1] !== '' ? window.location.href.split('/')[window.location.href.split('/').length - 1] !== 'employeeorder' ? window.innerWidth <= 768 ? window.innerHeight-50 : window.innerHeight-70 : '100%' : '100%',
							overflowY: window.location.href.split('/')[window.location.href.split('/').length - 1] !== '' ? 'scroll' : 'hidden'
						}}
					>
						<Routes>
							<Route exact path='/' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Login />
								</Suspense>
							} />
							<Route path='/employeeorder' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<EmployeeOrder mainpage={true} />
								</Suspense>
							} />
							<Route path='/dashboard' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Home />
								</Suspense>
							} />
							<Route path='/productos' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Products />
								</Suspense>
							} />
							<Route path='/tienda' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Tienda />
								</Suspense>
							} />
							<Route path='/ordenes' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Orders boxes={true} />
								</Suspense>
							} />
								<Route path='/clientes' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Users />
								</Suspense>
							} />
							<Route path='/expenses' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Expenses />
								</Suspense>
							} />
							<Route path='*' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<PageNotFound />
								</Suspense>
							} />
						</Routes>
					</div>
				</div>
			</div>
		</div>
);
}

export default App;

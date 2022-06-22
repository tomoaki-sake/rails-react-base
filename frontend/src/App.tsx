import CommonLayout from 'components/layouts/CommonLayout';
import Home from 'components/pages/Home';
import SignIn from 'components/pages/SignIn';
import SignUp from 'components/pages/SignUp';
import { User } from 'interfaces/index';
import { getCurrentUser } from 'lib/api/auth';
import { execTest } from 'lib/api/test';
import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom';

// グローバルで扱う変数と関数
export const AuthContext = createContext({} as {
	loading: boolean
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
	isSignedIn: boolean
	setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
	currentUser: User | undefined
	setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const App: React.FC = () => {

	const [loading, setLoading] = useState<boolean>(true)
	const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
	const [currentUser, setCurrentUser] = useState<User | undefined>()

	// 認証済みユーザーの存在チェック
	// 存在する場合はユーザー情報取得
	const handleGetCurrentUser = async () => {
		try {
			const res = await getCurrentUser()
			console.log(res)

			if(res?.status === 200) {
				setIsSignedIn(true)
				setCurrentUser(res?.data.currentUser)
			} else {
				console.log("No current user")
			}
		} catch (err) {
			console.log(err)
		}

		setLoading(false)
	}

	useEffect(() => {
		handleGetCurrentUser()
	}, [setCurrentUser])

	const Private = () => {
		if(!loading) {
			if(isSignedIn) {
				return <Outlet />
			} else {
				return <Navigate to={`/signup`} replace />
			}
		} else {
			return <></>
		}
	}

	return (
		<Router>
			<AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
				<CommonLayout>
					<Routes>
						<Route path="/signup" element={<SignUp />} />
						<Route path="/signin" element={<SignIn />} />
						<Route path='/' element={<Private />}>
              <Route path="/" element={<Home />} />
						</Route>
					</Routes>
				</CommonLayout>
			</AuthContext.Provider>
		</Router>
	)
}

export default App;

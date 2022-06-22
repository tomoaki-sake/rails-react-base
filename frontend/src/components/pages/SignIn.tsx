import React, { useContext, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "App";
import { SignInData } from "interfaces";
import { signIn } from "lib/api/auth";
import Cookies from "js-cookie";
import { Box, Button, Card, CardContent, CardHeader, TextField, Typography } from "@material-ui/core";
import AlertMessage from "components/utils/AlertMessage";


const useStyles = makeStyles((theme: Theme) => ({
    submitBtn: {
		paddingTop: theme.spacing(2),
		textAlign: "right",
		flexGrow: 1,
		textTransform: "none"
    },
    header: {
		textAlign: "center"
    },
    card: {
		padding: theme.spacing(2),
		maxWidth: 400
    },
    box: {
		paddingTop: "2rem"
    },
    link: {
        textDecoration: "none"
    }
}))

const SignIn: React.FC = () => {
    const classes = useStyles()
    const navigate = useNavigate()

    const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const data: SignInData = {
            email: email,
            password: password
        }

        try {
            const res = await signIn(data)
            console.log(res)

            if (res.status === 200) {
                // サインインに成功した場合、Cookieに各値を格納
                Cookies.set("_access_token", res.headers["access-token"])
                Cookies.set("_client", res.headers["client"])
                Cookies.set("_uid", res.headers["uid"])

                setIsSignedIn(true)
                setCurrentUser(res.data.data)

                navigate("/")

                console.log("Signed in successfully!")
            } else {
                setAlertMessageOpen(true)
            }
        } catch (err) {
            console.log(err)
            setAlertMessageOpen(true)
        }
    }

    return (
        <>
            <form noValidate autoComplete="off">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="サインイン" />
                    <CardContent>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="メールアドレス"
                            value={email}
                            margin="dense"
                            onChange={event => setEmail(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="パスワード"
                            type="password"
                            placeholder="6文字以上"
                            value={password}
                            margin="dense"
                            autoComplete="current-password"
                            onChange={event => setPassword(event.target.value)}
                        />
                        <Box className={classes.submitBtn} >
                            <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            disabled={!email || !password ? true : false}
                            onClick={handleSubmit}
                            >
                            送信
                            </Button>
                        </Box>
                        <Box textAlign="center" className={classes.box}>
                            <Typography variant="body2">
                            まだアカウントをお持ちでない方は
                            <Link to="/signup" className={classes.link}>
                                こちら
                            </Link>
                                から作成してください。
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </form>
            <AlertMessage
                open={alertMessageOpen}
                setOpen={setAlertMessageOpen}
                severity="error"
                message="メールアドレスかパスワードが間違っています。"
            />
        </>
    )
}

export default SignIn
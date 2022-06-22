import { Button, Card, CardContent, CardHeader, TextField } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AuthContext } from "App";
import AlertMessage from "components/utils/AlertMessage";
import { SignUpData } from "interfaces";
import Cookies from "js-cookie";
import { signUp } from "lib/api/auth";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    }
}))

const SignUp: React.FC = () => {
    const classes = useStyles()
    const navigate = useNavigate()

    const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
    const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const data: SignUpData = {
            name: name,
            email: email,
            password: password,
            passwordConfirmation: passwordConfirmation
        }

        try {
            const res = await signUp(data)
            console.log(res)

            if (res.status === 200) {
                // アカウント作成と同時にサインイン
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
                    <CardHeader className={classes.header} title="サインアップ" />
                    <CardContent>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="名前"
                            value={name}
                            margin="dense"
                            onChange={event => setName(event.target.value)}
                        />
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
                            value={password}
                            margin="dense"
                            autoComplete="current-password"
                            onChange={event => setPassword(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="パスワード（確認用）"
                            type="password"
                            value={passwordConfirmation}
                            margin="dense"
                            autoComplete="current-password"
                            onChange={event => setPasswordConfirmation(event.target.value)}
                        />
                        <div className={classes.submitBtn}>
                            <Button
                                type="submit"
                                variant="outlined"
                                color="primary"
                                disabled={!name || !email || !password || !passwordConfirmation ? true : false}
                                onClick={handleSubmit}
                            >
                                送信
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
            <AlertMessage // エラーが発生した場合はアラートを表示
                open={alertMessageOpen}
                setOpen={setAlertMessageOpen}
                severity="error"
                message="メールアドレスかパスワードが間違っています"
            />
        </>
    )
}

export default SignUp
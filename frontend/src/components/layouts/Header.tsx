import React, { useContext } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AuthContext } from "App";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "lib/api/auth";
import Cookies from "js-cookie";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu"


const useStyles = makeStyles((theme: Theme) => ({
    iconButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      textDecoration: "none",
      color: "inherit"
    },
    linkBtn: {
      textTransform: "none"
    }
}))

const Header: React.FC = () => {
    const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext)
    const classes = useStyles()
    const navigate = useNavigate()

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const res = await signOut()

            if (res.data.success === true) {
                // サインアウト次には各Cookieを削除
                Cookies.remove("_sccess_token")
                Cookies.remove("_client")
                Cookies.remove("_uid")

                setIsSignedIn(false)
                navigate("/signin")

                console.log("Succeeded in sign out")
            } else {
                console.log("Failed in sign out")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const AuthButton = () => {
        // 認証時　：サインアウト用ボタン
        // 未認証時：サインイン用ボタン
        if(!loading) {
            if (isSignedIn) {
                return (
                    <Button
                        color="inherit"
                        className={classes.linkBtn}
                        onClick={handleSignOut}
                    >
                        サインアウト
                    </Button>
                )
            } else {
                return (
                    <Button
                        color="inherit"
                        className={classes.linkBtn}
                        onClick={() => navigate("/signin")}
                    >
                        サインイン
                    </Button>
                )
            }
        } else {
            return <></>
        }
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.iconButton}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        className={classes.title}
                        component={Link}
                        to="/"
                    >
                        Sample
                    </Typography>
                    <AuthButton />
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Header
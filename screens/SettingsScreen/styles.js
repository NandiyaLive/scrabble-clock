import { StyleSheet, Dimensions } from "react-native";
import Constants from 'expo-constants'


const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: Constants.statusBarHeight,
        backgroundColor: "black",
        padding: 30,
        height: "100%"
    },
    pageTitle: {
        color: "white",
    },
    settingContainer:{
        marginVertical: 20,
    },
    settingTitle:{
        color: "white",
    },
    settingSubtitle: {
        color: "white",
        fontSize: 14
    },
    changeSettingContainer:{
        display: "flex",
        flexDirection: "row",
        marginBottom: 20
    },
    changeSettingLeft: {
        width: "70%"
    },
    changeSettingRight: {
        width: "30%",
        paddingLeft: 20
    },
    settingChangeButton: {
        padding: 0,
        height: 48,
        backgroundColor: '#ffd63f',
        color: "black",
        borderColor: '#ffd63f',
        
    },
    settingChangeInput: {
        height: 50
    },
    divider:{
        backgroundColor: "white",
        alignSelf: "stretch"
    }
    
});

export default styles;
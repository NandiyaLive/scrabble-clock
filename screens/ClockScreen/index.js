import React, { useState, useEffect } from 'react';
import { View, Pressable, SafeAreaView, Touchable, TouchableOpacity } from 'react-native';
import { Layout, Text, Button, Card, Modal, ButtonGroup } from '@ui-kitten/components';
import styles from './styles';
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from 'expo-status-bar';
import CountDown from '../../packages/CountdownTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PTRView from "react-native-pull-to-refresh";


const ClockScreen = ({ navigation }) => {

    const [clockTopRunning, setClockTopRunning] = useState(false);
    const [clockBottomRunning, setClockBottomRunning] = useState(false);
    const [isGamePaused, setIsGamePaused] = useState(true);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [resetModalVisible, setResetModalVisible] = useState(false);
    const [runningTaskByPause, setRunningTaskByPause] = useState("");

    //Game settings
    const [gameTime, setGameTime] = useState(13);
    const [gameOvertime, setGameOvertime] = useState(5);
    const [gamePenalty, setGamePenalty] = useState(2);

    //Reset Params
    const [topClockId, setTopClockId] = useState("100");
    const [bottomClockId, setBottomClockId] = useState("1000");

    //penalty
    const [topPenalty, setTopPenalty] = useState(0);
    const [bottomPenalty, setBottomPenalty] = useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getSettings();
        });

        return unsubscribe;
    }, [navigation]);

    const handlePlayPause = () => {
        if (!isGameStarted) {
            setIsGamePaused(false);
            setIsGameStarted(true);
            setClockBottomRunning(true);
        } else {
            if (isGamePaused) {
                setIsGamePaused(false);
                if (runningTaskByPause == "top") {
                    setClockTopRunning(true);
                } else {
                    setClockBottomRunning(true);
                }
            } else {
                setIsGamePaused(true);
                if (clockTopRunning) {
                    setRunningTaskByPause("top");
                } else {
                    setRunningTaskByPause("bottom");
                }
                setClockTopRunning(false);
                setClockBottomRunning(false);
            }
        }
    }

    const handleBottomTap = () => {
        if (isGameStarted && !isGamePaused) {
            setClockBottomRunning(false);
            setClockTopRunning(true);
        }
    }

    const handleTopTap = () => {
        if (isGameStarted && !isGamePaused) {
            setClockTopRunning(false);
            setClockBottomRunning(true);
        }
    }

    const resetGame = () => {
        setClockTopRunning(false);
        setClockBottomRunning(false);
        setRunningTaskByPause("");
        setIsGamePaused(true);
        setBottomClockId(Math.random().toString());
        setTopClockId(Math.random().toString());
        setResetModalVisible(false);

    }

    const getSettings = async () => {
        try {
            const time = await AsyncStorage.getItem('@time');
            const overtime = await AsyncStorage.getItem('@overtime');
            const penalty = await AsyncStorage.getItem('@penalty');

            if (time !== null) {
                setGameTime(parseInt(time));
            }
            if (overtime !== null) {
                setGameOvertime(parseInt(overtime));
            }
            if (penalty !== null) {
                setGamePenalty(parseInt(penalty));
            }

            //Reset the timer UIs
            setClockTopRunning(false);
            setClockBottomRunning(false);
            setIsGamePaused(true);
            setBottomClockId(Math.random().toString());
            setTopClockId(Math.random().toString());

        } catch (error) {
            console.log(error);
            alert("Could not load settings :(");
        }
    }


    return (
        <PTRView onRefresh={getSettings} style={{ height: "100%", backgroundColor: "#0c1d36" }}>
            <SafeAreaView style={styles.pageContainer}>
                <Layout style={styles.pageContainer}>
                    <Pressable style={clockTopRunning ? styles.clockActive : styles.clockView} onPress={handleTopTap}>
                        <View style={clockTopRunning ? styles.clockActive : styles.clockView}>
                            {(gameTime && gameOvertime && gamePenalty) && <CountDown
                                until={gameTime}
                                onFinish={(e) => console.log("Finished")}
                                timeToShow={['M', 'S']}
                                size={80}
                                digitStyle={{ backgroundColor: 'transparent' }}
                                digitTxtStyle={{ color: '#222B45', fontSize: 120 }}
                                timeLabels={{}}
                                showSeparator={true}
                                separatorStyle={{ padding: 0, margin: 0 }}
                                running={clockTopRunning}
                                id={topClockId || 456}
                                onChange={(e) => {
                                    console.log(e)
                                }}
                            />}
                            {topPenalty > 0 && <Text category='h1'>Penalty: {topPenalty}</Text>}
                        </View>
                    </Pressable>
                    <View style={styles.settingsBar}>
                        <Pressable style={styles.settingsButton} onPress={() => {
                            navigation.navigate("Settings");
                        }}>
                            <Ionicons name="time" size={50} color="white" style={{ padding: 0 }} />
                        </Pressable>
                        <Pressable style={styles.settingsButton} onPress={handlePlayPause}>
                            {isGamePaused ? <Ionicons name="play" size={50} color="white" style={{ padding: 0 }} /> :
                                <Ionicons name="pause" size={50} color="white" style={{ padding: 0 }} />}
                        </Pressable>
                        <Pressable style={styles.settingsButton} onPress={() => setResetModalVisible(true)}>
                            <Ionicons name="refresh" size={50} color="white" style={{ padding: 0 }} />
                        </Pressable>
                    </View>
                    <Pressable style={clockBottomRunning ? styles.clockActive : styles.clockView} onPress={handleBottomTap}>
                        <View style={clockBottomRunning ? styles.clockActive : styles.clockView}>
                            <CountDown
                                until={gameTime}
                                onFinish={(e) => console.log("Finished")}
                                timeToShow={['M', 'S']}
                                size={80}
                                digitStyle={{ backgroundColor: 'transparent' }}
                                digitTxtStyle={{ color: '#222B45', fontSize: 120 }}
                                timeLabels={{}}
                                showSeparator={true}
                                separatorStyle={{ padding: 0, margin: 0 }}
                                running={clockBottomRunning}
                                id={bottomClockId || 123}
                                onChange={(e) => {
                                    console.log(e)
                                }}
                            />
                            {bottomPenalty > 0 && <Text category='h1'>Penalty: {bottomPenalty}</Text>}
                        </View>
                    </Pressable>
                </Layout>
                <StatusBar hidden={false} backgroundColor="#000000" style="dark" />
                <Modal
                    visible={resetModalVisible}
                    backdropStyle={styles.backdrop}
                // onBackdropPress={() => setVisible(false)}
                >
                    <Card disabled={true} style={styles.modalCard}>
                        <Text category='h6'>
                            Are you sure you want to reset the timer?
                        </Text>
                        <Layout level='1' style={styles.modalButtons}>
                            <Button appearance='filled' status='danger' style={styles.modalButton} onPress={resetGame}>
                                Yes
                            </Button>
                            <Button appearance='outline' status='basic' style={styles.modalButton} onPress={() => setResetModalVisible(false)}>
                                No
                            </Button>
                        </Layout>
                    </Card>
                </Modal>
            </SafeAreaView>
        </PTRView>
    );
}


export default ClockScreen;
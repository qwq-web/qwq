function callAlert (title, callback) {
    const div = document.createElement('div');
    const btn = document.createElement('div');
    Object.assign(div.style, {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute',
        zIndex: 2
    });
    Object.assign(btn.style, {
        width: '50%',
        lineHeight: '40px',
        margin: '260px auto 0',
        border: '1px solid',
        textAlign: 'center',
        borderRadius: '20px',
        backgroundColor: '#ccc',
        cursor: 'pointer'
    });
    btn.innerHTML = title;
    btn.addEventListener('click', () => {
        callback && callback();
        div.remove();
    })
    div.appendChild(btn);
    return div;
}
class Main {
    constructor(el) {
        this.main = el;
        this.init();
    }
    static timers = [];
    static zidans = [];
    static diPlanes = [];
    static fenshu = 0;
    static shadishu = 0;
    static speed = 0.2;
    static bossFlag = true;
    static bgMusic = new Audio('./audio/bgm.mp3');
    static gameoverMusic = new Audio('./audio/gameover.mp3');
    // 打败一次boss后敌机提速生产
    static jiaQiang = false;
    init() {
        this.render();
        this.handle();
        Main.bgMusic.loop = true;
    }
    render() {
        Object.assign(this.main.style, {
           margin: '0 auto',
            border: '1px solid',
            width: '320px',
            height: '568px',
            backgroundImage: `url('./images/startBG.png')`,
            position: 'relative',
            overflow: 'hidden'
        });
        this.startGameBtn = document.createElement('button');
        Main.jiFenBoxNode = document.createElement('div');
        Object.assign(Main.jiFenBoxNode.style, {
            position: 'absolute',
            left: 0,
            top: 0,
            padding: '10px',
            zIndex: 9,
            color: 'red'
        });
        this.startGameBtn.innerHTML = '开始游戏',
        Object.assign(this.startGameBtn.style, {
            width: '160px',
            height: '40px',
            borderRadius: '20px',
            border: '1px solid',
            outlineWidth: '0',
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: '120px',
            left: 'calc(50% - 80px)'
        });
        this.main.appendChild(this.startGameBtn);
    }
    handle() {
        this.startGameBtn.addEventListener('click', this.gameStart.bind(this));
    }
    diPlanRun() {
        const imgSrcs = [
            {
                src1: './images/enemy1_fly_1.png',
                srcBoom: './images/小飞机爆炸.gif',
                w: 34,
                h: 24,
                id: 1
            },
            {
                src1: './images/enemy3_fly_1.png',
                srcAiDa: './images/中飞机挨打.png',
                srcBoom: './images/中飞机爆炸.gif',
                w: 46,
                h: 60,
                id: 2
            },
            {
                src1: './images/enemy2_fly_1.png',
                srcAiDa: './images/大飞机挨打.png',
                srcBoom: './images/大飞机爆炸.gif',
                w: 110,
                h: 164,
                id: 3
            }
        ];
        clearInterval(Main.diPlanTimer);
        Main.diPlanTimer = setInterval(() => {
            let index = parseInt(Math.random() * 8);
            if (index < 4) {
                index = 0;
            } else if (index >= 4 && index < 7) {
                index = 1;
            } else {
                index = 2;
            }
            const diFangPlane = new DiFangPlane(imgSrcs[index], Main.speed>=1?1:Main.speed+=0.02);
            Main.timers.push(diFangPlane.timer);
            Main.diPlanes.push(diFangPlane);
            this.main.appendChild(diFangPlane.diFangPlaneNode);
            // Boss出现--------------------------------------------
            if (Main.shadishu != 0 && Main.shadishu % 100 == 0) {
                Main.jiaQiang = true;
                clearInterval(Main.createDiJiTimer);
                clearInterval(Main.diPlanTimer);
                Main.bossFlag = false;
                Main.boss = new Boss();
                this.main.appendChild(Main.boss.diFangPlaneNode);
            }
        }, 1000 - Main.speed * 480 - (Main.jiaQiang?220:200));
    }
    gameStart() {
        Main.bgMusic.play();
        Main.jiFenBoxNode.innerHTML = '';
        this.main.appendChild(Main.jiFenBoxNode);
        this.startGameBtn.remove();
        this.main.style.backgroundImage = `url('./images/background_1.png')`;
        let bgnum = 0;
        Main.timers.push(setInterval(() => {
            this.main.style.backgroundPosition = `0px ${bgnum++}px`;
        }, 20));
        const myPlane = new MyPlane();
        Main.myPlane = myPlane;
        this.main.appendChild(myPlane.plane);
        this.diPlanRun();
        Main.createDiJiTimer = setInterval(() => {
            this.diPlanRun();
        }, 2000);
        Main.timers.push(Main.createDiJiTimer);
        clearInterval(Main.daojuTiemr);
        Main.daojuTiemr = setInterval(() => {
            const num = parseInt(Math.random() * 5);
            if (num == 1) {
                const daoju = new DaoJu(1);
                this.main.appendChild(daoju.daojuNode);
            } else if (num == 2) {
                const daoju = new DaoJu(2);
                this.main.appendChild(daoju.daojuNode);
            }
        }, 2200);
        const fenshu = document.createElement('p');
        fenshu.innerHTML = '分数:0';
        const shadishu = document.createElement('p');
        shadishu.innerHTML = '杀敌数:0';
        Main.jiFenBoxNode.appendChild(fenshu);
        Main.jiFenBoxNode.appendChild(shadishu);
    }
}

class MyPlane {
    constructor() {
        this.init();
    }
    init() {
        this.render();
        this.handle();
    }
    render() {
        this.plane = document.createElement('img');
        this.plane.src = './images/myPlane.gif';
        this.x = 127;
        this.y = 488;
        Object.assign(this.plane.style, {
            position: 'absolute',
            top: this.y + 'px',
            left: this.x + 'px',
            // border: '1px solid'
        });
    }
    handle() {
        Main.keydownFn = e => {
            e = e || window.event;
            const key = e.key || e.keyCode;
            switch (key) {
                case 'w':
                case 'W':
                case 87:
                    if (this.timerT) {
                        return;
                    }
                    this.timerT = setInterval(() => {
                        if (this.plane.offsetTop <= 10) {
                            this.y = 10;
                        } else {
                            this.y -= 1;
                        }
                        this.plane.style.top = this.y + 'px';
                    }, 5);
                    break;
                case 's':
                case 'S':
                case 83:
                    if (this.timerB) {
                        return;
                    }
                    this.timerB = setInterval(() => {
                        if (this.plane.offsetTop >= 488) {
                            this.y = 488;
                        } else {
                            this.y += 1;
                        }
                        this.plane.style.top = this.y + 'px';
                    }, 5);
                    break;
                case 'a':
                case 'A':
                case 65:
                    if (this.timerL) {
                        return;
                    }
                    this.timerL = setInterval(() => {
                        if (this.plane.offsetLeft <= 0) {
                            this.x = 0;
                        } else {
                            this.x -= 1;
                        }
                        this.plane.style.left = this.x + 'px';
                    }, 5);
                    break;
                case 'd':
                case 'D':
                case 68:
                    if (this.timerR) {
                        return;
                    }
                    this.timerR = setInterval(() => {
                        if (this.plane.offsetLeft >= 254) {
                            this.x = 254;
                        } else {
                            this.x += 1;
                        }
                        this.plane.style.left = this.x + 'px';
                    }, 5);
                    break;
                case '0':
                case 'Enter':
                case 96:
                case 13:
                    if (this.timerZiDan || this.gongJiFlag) {
                        return;
                    }
                    this.gongJiFlag = true;
                    setTimeout(() => {
                        this.gongJiFlag = false;
                    }, 180);
                    const zidan = new Zidan(this.plane.offsetLeft + 29, this.plane.offsetTop - 10);
                    this.plane.parentNode.appendChild(zidan.zidanNode);
                    Main.zidans.push(zidan);
                    if (Main.runLiaoJi) {
                        this.startLiaoJi();
                    }
                    new Audio('./audio/ndo.mp3').play();
                    this.timerZiDan = setInterval(() => {
                        const zidan = new Zidan(this.plane.offsetLeft + 29, this.plane.offsetTop - 10);
                        this.plane.parentNode.appendChild(zidan.zidanNode);
                        Main.zidans.push(zidan);
                        if (Main.runLiaoJi) {
                            this.startLiaoJi();
                        }
                        new Audio('./audio/ndo.mp3').play();
                    }, 200);
                    break;
            
                default:
                    break;
            }
        };
        document.addEventListener('keydown', Main.keydownFn);
        Main.keyupFn = e => {
            e = e || window.event;
            const key = e.key || e.keyCode;
            switch (key) {
                case 'w':
                case 'W':
                case 87:
                    clearInterval(this.timerT);
                    this.timerT = null;
                    break;
                case 's':
                case 'S':
                case 83:
                    clearInterval(this.timerB);
                    this.timerB = null;
                    break;
                case 'a':
                case 'A':
                case 65:
                    clearInterval(this.timerL);
                    this.timerL = null;
                    break;
                case 'd':
                case 'D':
                case 68:
                    clearInterval(this.timerR);
                    this.timerR = null;
                    break;
                case '0':
                case 'Enter':
                case 96:
                case 13:
                    clearInterval(this.timerZiDan);
                    this.timerZiDan = null;
                    break;
            
                default:
                    break;
            }
        };
        document.addEventListener('keyup', Main.keyupFn);
        // 移动端操作
        Main.TCMoveFn = e => {
            this.x = e.targetTouches[0].clientX - this.plane.parentNode.offsetLeft - 35;
            this.y = e.targetTouches[0].clientY - this.plane.parentNode.offsetTop - 40;
            if (this.x > 254) {
                this.x = 254;
            } else if (this.x < 0) {
                this.x = 0;
            }
            if (this.y > 488) {
                this.y = 488;
            } else if (this.y < 0) {
                this.y = 0;
            }
            this.plane.style.left = this.x + 'px';
            this.plane.style.top = this.y + 'px';
        };
        Main.TCEndFn = e => {
            e.preventDefault();
            document.removeEventListener('touchmove', Main.TCMoveFn);
        };
        Main.TCStratFn = e => {
            e.preventDefault();
            document.addEventListener('touchmove', Main.TCMoveFn);
            
        };
        this.plane.addEventListener('touchstart', Main.TCStratFn);
        this.plane.addEventListener('touchend', Main.TCEndFn);
        // 移动端子弹自动发射
        if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
            this.timerZiDan = setInterval(() => {
                const zidan = new Zidan(this.plane.offsetLeft + 29, this.plane.offsetTop - 10);
                this.plane.parentNode.appendChild(zidan.zidanNode);
                Main.zidans.push(zidan);
                if (Main.runLiaoJi) {
                    this.startLiaoJi();
                }
                new Audio('./audio/ndo.mp3').play();
            }, 200);
            [...document.getElementsByClassName('titleH')].forEach(el => {
                el.style.display = 'none';
            });
        }
    }
    startLiaoJi() {
        const zidanL = new Zidan(this.plane.offsetLeft + 6, this.plane.offsetTop + 6);
        this.plane.parentNode.appendChild(zidanL.zidanNode);
        Main.zidans.push(zidanL);
        const zidanR = new Zidan(this.plane.offsetLeft + 52, this.plane.offsetTop + 6);
        this.plane.parentNode.appendChild(zidanR.zidanNode);
        Main.zidans.push(zidanR);
    }
    over() {
        clearInterval(this.timerT);
        this.timerT = null;
        clearInterval(this.timerB);
        this.timerB = null;
        clearInterval(this.timerL);
        this.timerL = null;
        clearInterval(this.timerR);
        this.timerR = null;
        clearInterval(this.timerZiDan);
        this.timerZiDan = null;
        this.plane.src = './images/本方飞机爆炸.gif';
        Main.boss && clearInterval(Main.boss.timer);
        Boss.flag = false;
        clearInterval(Main.daojuTiemr);
        Main.gameoverMusic.play();
        Main.bgMusic.pause();
        document.removeEventListener('touchmove', Main.TCMoveFn);
        Main.timers.forEach(time => {
            clearInterval(time);
        });
        clearInterval(Main.diPlanTimer);
        document.removeEventListener('keydown', Main.keydownFn);
        document.removeEventListener('keyup', Main.keyupFn);
        Main.myPlane.plane.parentNode.appendChild(callAlert('重新开始', () => {
            Main.bgMusic.load();
            Main.bgMusic.pause();
            Main.myPlane.plane.parentNode.innerHTML = '';
            Main.zidans.length = 0;
            Main.diPlanes.length = 0;
            Main.timers.length = 0;
            Main.speed = 0.2;
            Main.runLiaoJi = false;
            Main.fenshu = 0;
            Main.shadishu = 0;
            Main.bossFlag = true;
            Main.bgMusic.src = './audio/bgm.mp3';
            main.gameStart();
        }));
    }
}

class Zidan {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.init();
    }
    init() {
        this.render();
        this.handle();
    }
    render() {
        this.zidanNode = document.createElement('div');
        // this.zidanNode.src = './images/bullet1.png';
        Object.assign(this.zidanNode.style, {
            position: 'absolute',
            width: '8px',
            height: '12px',
            borderRadius: '60%',
            border: '1px solid #000',
            backgroundColor: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
            top: this.y + 'px',
            left: this.x + 'px',
        });
    }
    handle() {
        this.timer = setInterval(() => {
            if (this.zidanNode.offsetTop <= 0) {
                this.over();
            }
            this.y = this.y - 2;
            this.zidanNode.style.top = this.y + 'px';
        }, 4);
    }
    over() {
        if (Main.zidans.indexOf(this) != -1) {
            Main.zidans.splice(Main.zidans.indexOf(this), 1);
        }
        clearInterval(this.timer);
        this.zidanNode.remove();
    }
}

class DiFangPlane {
    constructor(srcObj, speed) {
        this.srcObj = srcObj;
        this.speed = speed;
        this.aiDaCiShu = 0;
        this.init();
    }
    init() {
        this.render();
        this.handle();
    }
    render() {
        this.diFangPlaneNode = document.createElement('img');
        this.diFangPlaneNode.src = this.srcObj.src1;
        this.y = -this.srcObj.h;
        this.x = Math.random() * (320 - this.srcObj.w);
        Object.assign(this.diFangPlaneNode.style, {
            position: 'absolute',
            top: this.y + 'px',
            left: `${this.x}px`
        });
    }
    handle() {
        this.timer = setInterval(() => {
            if (this.diFangPlaneNode.offsetTop > 568) {
                this.over();
            }
            // 地方飞机死亡判断
            Main.zidans.forEach(item => {
                if ((item.x + 10 > this.x && item.x < this.x + this.srcObj.w) && (item.y <= this.y + this.srcObj.h && item.y + 20 > this.y)) {
                    item.over();
                    Main.jiFenBoxNode.firstElementChild.innerHTML = `分数:${++Main.fenshu}`;
                    if (this.srcObj.id == 1) {
                        this.diPlanOverFn();
                    } else if (this.srcObj.id == 2) {
                        this.aiDaCiShu += 1;
                        if (this.aiDaCiShu >= 3) {
                            this.diPlanOverFn();
                        } else {
                            this.aiDa();
                        }
                    } else if (this.srcObj.id == 3) {
                        this.aiDaCiShu += 1;
                        if (this.aiDaCiShu >= 5) {
                            this.diPlanOverFn();
                        } else {
                            this.aiDa();
                        }
                    }
                }
            });
            // 我方死亡判断
            if ((Main.myPlane.x + 66 > this.x && Main.myPlane.x < this.x + this.srcObj.w) && (Main.myPlane.y <= this.y + this.srcObj.h && Main.myPlane.y + 60 > this.y)) {
                Main.myPlane.over();
            }
            this.y += this.speed;
            this.diFangPlaneNode.style.top = this.y + 'px';
        }, 6);
    }
    diPlanOverFn(){
        // if (this.overTimerOut) {
        //     return;
        // }
        this.over();
        // this.overTimerOut = setTimeout(() => {
            Main.jiFenBoxNode.lastElementChild.innerHTML = `杀敌数:${++Main.shadishu}`;
        // }, 80);
    }
    over() {
        if (Main.timers.indexOf(this.timer) != -1) {
            Main.timers.splice(Main.timers.indexOf(this.timer), 1);
        }
        if (Main.diPlanes.indexOf(this) != -1) {
            Main.diPlanes.splice(Main.diPlanes.indexOf(this), 1);
        }
        this.diFangPlaneNode.src = this.srcObj.srcBoom;
        clearInterval(this.timer);
        setTimeout(() => {
            this.diFangPlaneNode.remove();
        }, 80);
    }
    aiDa() {
        this.diFangPlaneNode.src = this.srcObj.srcAiDa;
    }
}

class DaoJu {
    constructor(typeNum) {
        this.typeNum = typeNum;
        this.init();
    }
    init() {
        this.render();
        this.handle();
    }
    render() {
        this.daojuNode = document.createElement('img');
        if (this.typeNum == 1) {//三连发
            this.daojuNode.src = './images/bullet_supply.png';
            this.y = -88;
            this.w = 58;
            this.h = 88;
        } else {// 全屏炸弹
            this.daojuNode.src = './images/bomb_supply.png';
            this.y = -107;
            this.w = 60;
            this.h = 107;
        }
        this.x = Math.random() * (320 - 58);
        Object.assign(this.daojuNode.style, {
            position: 'absolute',
            top: this.y + 'px',
            left: this.x + 'px',
            zIndex: 2
        });
    }
    handle() {
        this.timer = setInterval(() => {
            if (this.daojuNode.offsetTop > 568) {
                this.over();
            }
            // 吃到道具
            if ((Main.myPlane.x + 66 > this.x && Main.myPlane.x < this.x + this.w) && (Main.myPlane.y <= this.y + this.h && Main.myPlane.y + 80 > this.y)) {
                if (this.typeNum == 1) {
                    new Audio('./audio/chi.mp3').play();
                    clearTimeout(Main.LiaoJiTimerOut);
                    Main.runLiaoJi = true;
                    Main.LiaoJiTimerOut = setTimeout(() => {
                        Main.runLiaoJi = false;
                    }, 10000);
                } else {
                    new Audio('./audio/bigboom.mp3').play();
                    Main.shadishu += Main.diPlanes.length;
                    if (Main.haveBoss) {
                        Main.jiFenBoxNode.firstElementChild.innerHTML = `分数:${Main.fenshu += 20}`;
                        Main.boss.aiDaCiShu += 20;
                    } else {
                        Main.jiFenBoxNode.firstElementChild.innerHTML = `分数:${Main.fenshu += Main.diPlanes.length * 2}`;
                    }
                    Main.jiFenBoxNode.lastElementChild.innerHTML = `杀敌数:${Main.shadishu}`;
                    for (let i = 0; i < Main.diPlanes.length; ) {
                        Main.diPlanes[i].over();
                    }
                }
                this.over();
            }
            this.y += 1;
            this.daojuNode.style.top = this.y + 'px';
        }, 10);
        Main.timers.push(this.timer);
    }
    over() {
        if (Main.timers.indexOf(this.timer) != -1) {
            Main.timers.splice(Main.timers.indexOf(this.timer), 1);
        }
        this.daojuNode.remove();
        clearInterval(this.timer);
    }
}

class BossZiDan {
    constructor(x, y, myPlaneX, myPlaneY) {
        this.x = x;
        this.y = y;
        this.bossX = x;
        this.myPlaneX = myPlaneX;
        this.myPlaneY = myPlaneY;
        this.bgN = 0;
        this.init();
    }
    init() {
        this.render();
        this.handle();
    }
    render() {
        this.zidanNode = document.createElement('div');
        Object.assign(this.zidanNode.style, {
            position: 'absolute',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'red',
            boxShadow: '0 0 4px rgb(255, 72, 0)',
            top: this.y + 'px',
            left: this.x + 'px',
        });
    }
    handle() {
        this.timer = setInterval(() => {
            if (this.zidanNode.offsetTop >= 568) {
                this.over();
            }
            this.zidanNode.style.backgroundColor = String(this.bgN++)[String(this.bgN).length - 3] % 2 == 0?'red':'yellow';
            this.y += this.myPlaneY / 400;
            this.x += (this.myPlaneX - this.bossX) / 400;
            this.zidanNode.style.top = this.y + 'px';
            this.zidanNode.style.left = this.x + 'px';
            // 我方死亡判断
            if ((Main.myPlane.x + 66 > this.x && Main.myPlane.x < this.x + 16) && (Main.myPlane.y <= this.y + 16 && Main.myPlane.y + 60 > this.y)) {
                Main.myPlane.over();
            }
        }, 10);
    }
    over() {
        if (Main.timers.indexOf(this.timer) != -1) {
            Main.timers.splice(Main.timers.indexOf(this.timer), 1);
        }
        Main.zidans.splice(Main.zidans.indexOf(this), 1);
        clearInterval(this.timer);
        this.zidanNode.remove();
    }
}

class BossZiDanJiGuang {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.init();
    }
    init() {
        this.render();
        this.handle();
    }
    render() {
        this.zidanNode = document.createElement('img');
        this.zidanNode.src = './images/fire.png';
        Object.assign(this.zidanNode.style, {
            position: 'absolute',
            width: '58px',
            height: '117px',
            top: this.y + 'px',
            left: this.x + 'px',
        });
    }
    handle() {
        this.timer = setInterval(() => {
            if (this.zidanNode.offsetTop >= 568) {
                this.over();
            }
            this.y += 1;
            this.zidanNode.style.top = this.y + 'px';
            // 我方死亡判断
            if ((Main.myPlane.x + 66 > this.x && Main.myPlane.x < this.x + 58) && (Main.myPlane.y <= this.y + 117 && Main.myPlane.y + 60 > this.y)) {
                Main.myPlane.over();
            }
        }, 10);
    }
    over() {
        if (Main.timers.indexOf(this.timer) != -1) {
            Main.timers.splice(Main.timers.indexOf(this.timer), 1);
        }
        Main.zidans.splice(Main.zidans.indexOf(this), 1);
        clearInterval(this.timer);
        this.zidanNode.remove();
    }
}

class Boss {
    constructor() {
        this.bossZidanNum = 0;
        this.srcObj = {
            src1: './images/boss.png',
            srcBoom: './images/boomx.png',
            w: 160,
            h: 118
        };
        this.aiDaCiShu = 0;
        this.init();
    }
    static flag = false;
    init() {
        Main.haveBoss = true;
        Boss.flag = false;
        Main.bgMusic.src = './audio/boss.mp3';
        Main.bgMusic.play();
        new Audio('./audio/bossrun.mp3').play();
        this.render();
        this.handle();
    }
    render() {
        this.diFangPlaneNode = document.createElement('img');
        this.diFangPlaneNode.src = this.srcObj.src1;
        this.y = -this.srcObj.h;
        this.x = Math.random() * (320 - this.srcObj.w);
        this.tempX = 1;
        this.tempY = 1;
        Object.assign(this.diFangPlaneNode.style, {
            position: 'absolute',
            top: this.y + 'px',
            left: `${this.x}px`,
            zIndex: 3
        });
        this.xueTiaoNode = document.createElement('div');
        Object.assign(this.xueTiaoNode.style, {
            position: 'absolute',
            top: '10px',
            left: `0px`,
            boxSizing: 'border-box',
            boxShadow: '0 0 2px yellow',
            borderRadius: '5px',
            width: '100%',
            height: '10px',
            borderLeft: '320px solid red'
        });
        Main.myPlane.plane.parentNode.appendChild(this.xueTiaoNode);
    }
    handle() {
        this.timer = setInterval(() => {
            // Boss挨打死亡判断
            if (this.aiDaCiShu >= 500) {
                Main.haveBoss = false;
                this.over();
                return;
            }
            Main.zidans.forEach(item => {
                if ((item.x + 10 > this.x && item.x < this.x + this.srcObj.w) && (item.y <= this.y - 16 + this.srcObj.h && item.y + 20 > this.y)) {
                    item.over();
                    Main.jiFenBoxNode.firstElementChild.innerHTML = `分数:${++Main.fenshu}`;
                    if (this.aiDaCiShu++ == 500) {
                        Main.haveBoss = false;
                        this.over();
                    }
                }
            });
            this.xueTiaoNode.style.borderLeft = `${(500 - this.aiDaCiShu) * 0.64}px solid red`;
            // 我方死亡判断
            if ((Main.myPlane.x + 66 > this.x && Main.myPlane.x < this.x + this.srcObj.w) && (Main.myPlane.y <= this.y - 16 + this.srcObj.h && Main.myPlane.y + 60 > this.y)) {
                Main.myPlane.over();
            }
            if (this.x <= 0 || this.x >= 320 - this.srcObj.w) {
                this.tempX = -this.tempX;
            }
            if (Boss.flag && this.y <= 0 || this.y >= 60) {
                this.tempY = -this.tempY;
            }
            if (this.y > 0) {
                Boss.flag = true;
            }
            this.x += 0.2 * this.tempX;
            this.y += 0.2 * this.tempY;
            this.diFangPlaneNode.style.left = this.x + 'px';
            this.diFangPlaneNode.style.top = this.y + 'px';
            // =============boss发子弹===============
            if (this.bossZidanNum++ % (parseInt(Math.random() * 300) + 200) == 0) {
                const bossZiDan = new BossZiDan(this.x + 75, this.y + 110, Main.myPlane.x + 33, Main.myPlane.y + 30);
                Main.myPlane.plane.parentNode.appendChild(bossZiDan.zidanNode);
            }
            if (this.bossZidanNum != 0 && this.bossZidanNum % 900 == 0) {
                const bossZiDan = new BossZiDanJiGuang(this.x + 51, this.y);
                Main.myPlane.plane.parentNode.appendChild(bossZiDan.zidanNode);
            }
        }, 10);
    }
    over() {
        Main.bgMusic.src = './audio/bgm.mp3';
        Main.bgMusic.play();
        new Audio('./audio/bossover.mp3').play();
        clearInterval(this.timer);
        this.diFangPlaneNode.src = this.srcObj.srcBoom;
        Main.jiFenBoxNode.lastElementChild.innerHTML = `杀敌数:${++Main.shadishu}`;
        if (Main.timers.indexOf(Main.createDiJiTimer) != -1) {
            Main.timers.splice(Main.timers.indexOf(Main.createDiJiTimer));
        }
        Main.createDiJiTimer = setInterval(() => {
            main.diPlanRun();
        }, 2000);
        Main.timers.push(Main.createDiJiTimer);
        setTimeout(() => {
            this.diFangPlaneNode.remove();
        }, 200);
        this.xueTiaoNode.remove();
    }
    overAgin() {
        Main.bgMusic.src = './audio/bgm.mp3';
        Main.bgMusic.play();
        clearInterval(this.timer);
    }
}

let main = new Main(document.querySelector('section'));
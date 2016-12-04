<?php
/**
 * 观察者模式
 * 将不同逻辑的代码解耦
 * Created by PhpStorm.
 * User: zhangshiping
 * Date: 2016/12/3
 * Time: 22:13
 */
namespace DesignMode;

/**
 * 事件观察者
 * Interface Observer
 */
interface Observer{
    /**
     * 观察者执行代码
     * @return mixed
     */
    public function todo($info=[]);
}

class Observer1 implements Observer{
    public function todo($info=[])
    {
        //逻辑代码一
        in_array(1,$info) and print('观察到逻辑一<br />');
    }
}
class Observer2 implements Observer{
    public function todo($info=[])
    {
        //逻辑代码二
        in_array(2,$info) and print('观察到逻辑二<br />');
    }
}

/**
 * 事件发生抽象类
 * Class EventObserver
 */
abstract class EventGenerator{
    /**
     * 存放观察者
     * @var array
     */
    private $observers = [];

    /**
     * 观察者参数信息
     * @var array
     */
    protected $observerParameters=[];

    /**
     * 添加观察者
     * @param Observer $observer
     */
    public function addObserver(Observer $observer){
        $this->observers[] = $observer;
    }

    /**
     * 执行观察者操作
     */
    public function notify(){
        foreach($this->observers as $observer){
            $observer->todo($this->observerParameters);
        }
    }

}
/**
 * 具体事件类
 * Class Event
 */
class Event extends EventGenerator{
    /**
     * 事件触发
     */
    public function trigger(){
        $this->observerParameters[] = 1;
        $this->observerParameters[] = 2;
        $this->notify();
        exit('事件执行结束!');
    }
}

$event = new Event();
$event->addObserver(new Observer1()); //添加观察者一
$event->addObserver(new Observer2()); //添加观察者二
$event->trigger();

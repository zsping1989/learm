<?php
/**
 * Created by PhpStorm.
 * User: zhangshiping
 * Date: 2016/12/4
 * Time: 13:42
 * 单列模式
 * 一个类只能创建一个对象
 */
namespace DesignMode;

/**
 * 单列模拟对象
 * Class DB
 */
class DB{
    /**
     * 存放单列对象
     * @var
     */
    protected static $db;

    /**
     * 禁止外部创建对象
     * DB constructor.
     */
    private function __construct(){
    }

    /**
     * 外部获取单列DB对象
     * @return DB
     */
    public static function getInstance(){
        if(self::$db){
            return self::$db;
        }
        self::$db = new self();
        return self::$db;
    }
}

$db1 = DB::getInstance();
$db2 = DB::getInstance();
var_dump($db1,$db2);

/**
/**
 * c_custom.js
 *
 * @description :: 客户信息表
 *
 * Created by lijing on 2017/4/20.
 */

import {BaseModel} from './BaseModels/BaseModel';

export default class extends BaseModel {
  constructor() {
    super();
  }

  static tableName = 'c_custom';
  static attributes = {
        id: {type: 'integer', primaryKey: true, autoIncrement: true},//Id
        name: {type: 'string'},//姓名
        car_number: {type: 'string'},// 车牌号
        tel:{type: 'string'},//手机号
        customtype: {type: 'string'}//客户类型（月卡1、年卡2、散客0）
        
    }
};

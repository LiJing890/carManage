/**
/**
 * hroomtype.js
 *
 * @description :: 房型信息表
 *
 * Created by libinqi on 2016/7/3.
 */

import {BaseModel} from './BaseModels/BaseModel';

export default class extends BaseModel {
  constructor() {
    super();
  }

  static tableName = 'hroomtype';
  static attributes = {
        id: {type: 'integer', primaryKey: true, autoIncrement: true},//Id
        rtname: {type: 'string'},//房型名称
        rtcode: {type: 'string'},//房型编码
        rtconfig:{type: 'string'},//配置名称
        rtconfigids:{type: 'string'},//配置id
        rtconfignum:{type: 'string'},//配置数量
        pricehour: {type: 'float'},//单价_小时
        priceday: {type: 'float'},//单价_天
        remark:{type:'string'}// 备注
    }
};

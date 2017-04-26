/**
/**
 * hbook.js
 *
 * @description :: 客户预订信息表
 *
 * Created by libinqi on 2016/7/3.
 */

import {BaseModel} from './BaseModels/BaseModel';

export default class extends BaseModel {
  constructor() {
    super();
  }

  static tableName = 'huser';
  static attributes = {
        id: {type: 'integer', primaryKey: true, autoIncrement: true},//Id
        name: {type: 'string'},//姓名
        isadmin: {type: 'boolean'}//是否管理员
    }
};

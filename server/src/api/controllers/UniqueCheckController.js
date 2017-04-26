/**
 * Created by libinqi on 2016/6/30.
 */

export function checkCode(req, res) {
  let modelName = req.allParams().modelName;
  let code = req.allParams().code;
  let id = req.allParams().id;

  if(!modelName)
  {
    res.serverError('实体名称不能为空');
    return;
  }
  if(!code)
  {
    res.serverError('code不能为空');
    return;
  }

 sails.models[modelName.toLowerCase()].findOne({code: code, isDelete: false}).then((data)=> {
    if (data && data.id != id) {
      res.ok('false');
    }
    else {
      res.ok('true');
    }
  }).catch((err)=> {
    res.ok('false');
  });
}

export function checkName(req, res) {
  let modelName = req.allParams().modelName;
  let name = req.allParams().name;
  let id = req.allParams().id;

  if(!modelName)
  {
    res.serverError('实体名称不能为空');
    return;
  }
  if(!name)
  {
    res.serverError('name不能为空');
    return;
  }

  sails.models[modelName.toLowerCase()].findOne({name: name, isDelete: false}).then((data)=> {
    if (data && data.id != id) {
      res.ok('false');
    }
    else {
      res.ok('true');
    }
  }).catch((err)=> {
    res.ok('false');
  });
}

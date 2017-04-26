(function() {
  var DHPlayer;
  var __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };
  DHPlayer = (function() {
    DHPlayer.load = function(canvasVideo, width, height) {
	   width = width || 1280;
	   height = height || 720;
	   return new DHPlayer(canvasVideo, width, height);
    };
	DHPlayer.convertCanvasToImage = function(imageData, carNumBox){
	  var image_src=process.cwd() + '/'+ new Date().getTime()+'carnum.jpg';
	  fs.writeFile(image_src, imageData, function (err) {
		if (err) throw err;
		var imgCanvas = carNumBox;
		var imageObj = new Image();
		imageObj.width = 1280;
		imageObj.height = 784;
		imageObj.src = image_src;

		imageObj.onload = function() {
		  imgCanvas.getContext('2d').drawImage(imageObj,400,340,1280,784,0,0,800,350);
		  fs.unlinkSync(image_src);
		};
	  });
	};
    function DHPlayer(canvasVideo, width, height) {
      var width = width;
      var height = height;

      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.ImageSmoothingEnabled = false;
      // context.webkitImageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;

      var retCanvas = canvasVideo;
      var retCtx= retCanvas.getContext('2d');
      var output,outputData,yOffset,uOffset,vOffset,ypos,upos,vpos,Y,U,V,R,G,B,outputData_pos,yuv,task;

      this.q = async.cargo(function (tasks, callback) {
          for(var i=0; i<tasks.length; i++){
            task = tasks[i];
            yuv = task.yuv;
            output = context.createImageData(width, height);
            outputData = output.data;

            yOffset = 0;
            uOffset = width * height;
            vOffset = width * height + (width*height)/4;
            for (var h=0; h<height; h++) {
              for (var w=0; w<width; w++) {
                ypos = w + h * width + yOffset;

                upos = (w>>1) + (h>>1) * width/2 + uOffset;
                vpos = (w>>1) + (h>>1) * width/2 + vOffset;

                Y = yuv[ypos];
                U = yuv[upos] - 128;
                V = yuv[vpos] - 128;

                R =  (Y + 1.371*V);
                G =  (Y - 0.698*V - 0.336*U);
                B =  (Y + 1.732*U);

                outputData_pos = w*4 + width*h*4;
                outputData[0+outputData_pos] = R;
                outputData[1+outputData_pos] = G;
                outputData[2+outputData_pos] = B;
                outputData[3+outputData_pos] = 255;
              }
            }

            context.putImageData(output, 0, 0);
            retCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, retCanvas.width, retCanvas.height);
          }
          callback();
        }, 50);
    }
    DHPlayer.prototype.play = function(yuv) {
      this.q.push({yuv: yuv});
    };
    return DHPlayer;
  })();
  window.DHPlayer = DHPlayer;
}).call(this);

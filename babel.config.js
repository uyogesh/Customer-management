module.exports = function(api) {
  api.cache(true);
  return {
    presets: [['@babel/preset-env'], ["@babel/preset-react"], ["module:metro-react-native-babel-preset"], ['react-app']],
    ignore: [ "node_modules/art/core/color.js" ],
    plugins: [
      
        ["module-resolver",
        
        {
        "alias": {
          "^react-native$": "react-native-web"
        }
      },'@babel/plugin-proposal-class-properties'],
    
    ],
   
  };
};

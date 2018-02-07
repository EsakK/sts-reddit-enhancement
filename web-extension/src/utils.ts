export class Utils {

  static arrayIncluded(arrayA : Array<string>, arrayB : Array<string>, indexStart : number) {
    if (arrayA.length > arrayB.length - indexStart) return false;
  
    for (var i = 0; i < arrayA.length; i++) {
      if (arrayA[i].toUpperCase() != arrayB[i + indexStart].toUpperCase()) return false;
    }
  
    return true;
  }  
}


//  return true if a word is plural 

export const isPlural = (word)=> {
  const pluralRegex = /s\b/;

  // Check if the word is not the same in its singular and plural forms

  if (pluralRegex.test(word)) {
    // Remove 's' at the end
    word = word.toLowerCase();
    const singularForm = word.replace(/s\b/, ''); 
    // return true if the word is plural or the word ends with leaves e.g Basil leaves.
    return word !== singularForm && word !== `${singularForm.split(" ")[0]} leaves`;
  }
  return false;
}



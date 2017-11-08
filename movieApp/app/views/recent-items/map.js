function(name) {
  if (doc.name == name) {
    emit(name, doc.movies);
  }
};
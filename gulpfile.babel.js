import gulp from 'gulp'

const clear = (cb) => {
  console.log(cb())
  console.log('clear task')
}

export default gulp.series(clear)

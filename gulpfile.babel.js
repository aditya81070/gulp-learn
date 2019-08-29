import gulp from 'gulp'
import browserSync from 'browser-sync'
import htmlmin from 'gulp-htmlmin'
import del from 'del'
const server = browserSync.create()

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  }
}

const clean = () => del(['dist'])

const reload = (done) => {
  server.reload()
  done()
}

const serve = (done) => {
  server.init({
    server: {
      baseDir: './dist/'
    }
  })
  done()
}

const copyHtml = () => {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true,
      preserveLineBreaks: false
    }))
    .pipe(gulp.dest(paths.html.dest))
}

const watchFiles = () => gulp.watch(paths.html.src, gulp.series(copyHtml, reload))

const dev = gulp.series(clean, copyHtml, serve, watchFiles)

export default dev
export { copyHtml, serve, reload, watchFiles }

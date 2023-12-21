export default async function (path) {
  const res = await fetch(`./bin/${path}`)
  return res.arrayBuffer()
}

const fetch = require('node-fetch');
const fs = require('fs');

let where = ""
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "";

async function get_request() {
  let array = []
  const url = 'https://nodejs.org/dist/index.json'
  const res = await fetch(url);
  const data = await res.json();//assuming data is json
  data.forEach(function (item) {
    //if item.files array has linux-armv6l
    if (item.files.includes("linux-armv6l")) {
      console.log(item.version)
      try {
        if (fs.existsSync('./install-node-' + item.version + '.sh')) {
          console.log('File exists');
        } else {
          let content = ''
          try {
            const data = fs.readFileSync('./install-node-v.example_official.sh', 'utf8')
            console.log(data)
            content = data.replace('{{version}}', item.version)
          } catch (err) {
            console.error(err)
          }
          fs.writeFile('./install-node-' + item.version + '.sh', content, err => {
            if (err) {
              console.error(err)
              return
            }
            //file written successfully
          })
        }
        array.push(item.version.substring(1))
      } catch (err) {
        console.error(err)
      }
    }
  })

  const unofficialurl = 'https://unofficial-builds.nodejs.org/download/release/index.json'
  const unofficialres = await fetch(unofficialurl);
  const unofficialdata = await unofficialres.json();//assuming data is json
  unofficialdata.forEach(function (item) {
    if (item.files.includes("linux-armv6l")) {
      console.log(item.version)
      try {
        if (fs.existsSync('./install-node-' + item.version + '.sh')) {
          console.log('File exists');
        } else {
          let content = ''
          try {
            const data = fs.readFileSync('./install-node-v.example.sh', 'utf8')
            console.log(data)
            content = data.replace('{{version}}', item.version)
          } catch (err) {
            console.error(err)
          }
          fs.writeFile('./install-node-' + item.version + '.sh', content, err => {
            if (err) {
              console.error(err)
              return
            }
            //file written successfully
          })
        }
        array.push(item.version.substring(1))
      } catch (err) {
        console.error(err)
      }
    }
  })
  return array
  //console.log(data)
}

get_request().then(function (data) {
  wow = data.map(a => a.split('.').map(n => +n + 100000).join('.')).sort().map(a => a.split('.').map(n => +n - 100000).join('.'));

  let version = [];
  let lastof = [];

  wow.forEach(element => {
    //if element.substring(1,2) not found in version array then add it
    //get number before .
    if (version.indexOf(element.substring(0, 2)) == -1) {
      //if element.substring(0,2) has . then remove .
      /*if (element.substring(0, 2).includes('.')) {
        version.push(element.substring(0, 2).replace('.', ''))
      } else {*/
        version.push(element.substring(0, 2))
      //}
    }
  })

  console.log(version)

  /*for (let i = 0; i < version.length; i++) {
    //let temp = [];
    wow.forEach(element => {
      if (element.substring(0, 1) == version[i] && element.substring(0, 1) != version[i+1]) {
        //temp.push(element)
        lastof.push(element)
      }
    })
    //lastof.push(temp[temp.length - 1])
  }*/

  for(let i = 0; i < wow.length; i++) {
    for(let j = 0; j < version.length; j++) {
      if(wow[i].substring(0, 2) == version[j] && wow[i].substring(0, 2) != version[j+1]) {
        lastof.push(wow[i])
      }
    }
  }

  console.log(lastof)

  /*wow.forEach(element => {
    where += "\n## v" + element + "\n```sh\n$ wget -O - https://raw.githubusercontent.com/" + GITHUB_REPOSITORY + "/master/install-node-v" + element + ".sh | bash\n```\n"
  });*/

  lastof.forEach(element => {
    where += "\n## v" + element + "\n```sh\n$ wget -O - https://raw.githubusercontent.com/" + GITHUB_REPOSITORY + "/master/install-node-v" + element + ".sh | bash\n```\n"
  });

  let haha
  try {
    const data = fs.readFileSync('./README_example.md', 'utf8')
    console.log(data)
    haha = data.replace('{{testlink}}', where)
  } catch (err) {
    console.error(err)
  }
  fs.writeFile('./README.md', haha, err => {
    if (err) {
      console.error(err)
      return
    }
    const data = fs.readFileSync('./README.md', 'utf8')
    console.log(data)
    //file written successfully
  })
})

/*fetch('https://unofficial-builds.nodejs.org/download/release/index.json')
  .then(res => res.json())
  .then(json => {
    json.forEach(element => {
      console.log(element.version);
      try {
        if (fs.existsSync('./install-node-' + element.version + '.sh')) {
          console.log('File exists');
        } else {
          let content = ''
          try {
            const data = fs.readFileSync('./install-node-v.example.sh', 'utf8')
            console.log(data)
            content = data.replace('{{version}}', element.version)
          } catch (err) {
            console.error(err)
          }
          fs.writeFile('./install-node-' + element.version + '.sh', content, err => {
            if (err) {
              console.error(err)
              return
            }
            //file written successfully
          })
        }
      } catch (err) {
        console.error(err)
      }
    });

    let wow = []

    filenames = fs.readdirSync(__dirname);

    console.log("\nCurrent directory filenames:");
    filenames.forEach(file => {
      //console.log(file);
      if (file.startsWith('install-node-') && file.search("example") == -1) {
        console.log(file)
        wow.push(file.substring(file.lastIndexOf("install-node-") + 14, file.indexOf(".sh")))
      }
    });

    wow = wow.map(a => a.split('.').map(n => +n + 100000).join('.')).sort().map(a => a.split('.').map(n => +n - 100000).join('.'));

    wow.forEach(element => {
      where += "\n## v" + element + "\n```sh\n$ wget -O - https://raw.githubusercontent.com/" + GITHUB_REPOSITORY + "/master/install-node-v" + element + ".sh | bash\n```\n"
    });

    let haha
    try {
      const data = fs.readFileSync('./README_example.md', 'utf8')
      console.log(data)
      haha = data.replace('{{testlink}}', where)
    } catch (err) {
      console.error(err)
    }
    fs.writeFile('./README.md', haha, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
  });*/
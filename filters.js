const filtersMap = {
  content: [
    'Skill',
    // 'Course',
    'Pedagogical',
    'Learning Path',
    'Tutorial'
  ],
  segment: [
    'business',
    'early_childhood',
    'preprimary',
    'primary',
    'basic',
    'secondary',
    'vocational',
    'higher',
    'adult',
    'non_formal_adult'
  ],
  subject: [
    'Learning',
    'Online Work',
    'Distance Teaching',
    'Distance Learning',
    'Online Meeting',
    'Teamwork',
    'Mobile Work',
    'Information Search',
    'Presentation',
    'Publishing',
    'Production',
    'Printing',
    'Virtual Reality',
    'Robotics',
    'Maker',
    'Game based Learning'
  ],
  media: [
    'Photo',
    'Audio',
    'Text',
    'Code',
    'Drawing',
    'Video',
    'AR',
    'VR',
    'Animation',
    '3D',
    'Simulation',
    '360-image',
    'Game',
    'Music'
  ],
  vendor: [
    'Adobe',
    'Apple',
    'Bee-Bot',
    'Blue-Bot',
    'Book Creator',
    'Bulb',
    'Class VR',
    'Do Ink',
    'Duck Duck Moose',
    'Educycle',
    'Google',
    'HP',
    'Insta 360',
    'Lego',
    'BBC Micro Bit',
    'Microsoft',
    'Padlet',
    'Samsung',
    'Sphero',
    'Wevideo',
    'Theta',
    'Thinglink',
    'Turnitin',
    'Zoom',
    'Other'
  ],
  hardware: [
    'Chromebook',
    'Computer, Win',
    'Computer, Mac',
    'Android device',
    'iOS device',
    'Robot',
    'Camera',
    '360 Camera',
    'VR-glasses',
    'Printer',
    'Data Projector'
  ]
}

const filterParamsMap = {
  content: {
    Skill: 'type:guide',
    Course: 'type:collection',
    Tutorial: 'type:info',
    'Learning Path': 'type:training',
    Pedagogical: 'type:pedagogical'
  },
  segment: {
    business: 'segment:business',
    early_childhood: 'segment:early_childhood',
    preprimary: 'segment:preprimary',
    primary: 'segment:primary',
    basic: 'segment:basic',
    secondary: 'segment:secondary',
    vocational: 'segment:vocational',
    higher: 'segment:higher',
    adult: 'segment:adult',
    non_formal_adult: 'segment:non_formal_adult'
  },
  subject: val => `subject:"${val.toLowerCase()}"`,
  media: val => `icons:"${val.toLowerCase()}"`,
  vendor: val => `vendor:"${val}"`,
  hardware: val => `tech:"${val}"`
}

const getSearchFilters = filters => {
  const out = []
  console.log('build filters', filters)
  Object.keys(filters).map(key => {
    const filterFn = filterParamsMap[key]
    if (!filters[key] || !filters[key].length || !filterFn) {
      return null
    }

    const values = typeof filterFn === 'function'
      ? filters[key].map(filterFn)
      : typeof filterFn === 'object'
        ? filters[key].map(val => filterFn[val])
        : null
    if (!values) {
      return null
    }
    if (!values.filter(Boolean).length) {
      return null // do not fail algolia search if filter is undefined
    }

    const param = values.length ? `(${values.join(' OR ')})` : values
    console.log(values, param)
    out.push(param)
  })
  return out.filter(Boolean).join(' AND ')
}

const getFilterkey = filter => {
  if (!filter) {
    return
  }
  const key = 'filters.' + filter.toLowerCase()
    .replace(/[\s+|,|()]+/g, ' ').trim()
    .replace(/\s+/, '_')
  return key
}

export {
  filtersMap,
  filterParamsMap,
  getSearchFilters,
  getFilterkey
}

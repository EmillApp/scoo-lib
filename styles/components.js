const colors = require('./colors')
const constants = require('./constants')

module.exports = {
  panel: {
    borderColor: colors.silver.light,
    height: 60
  },
  panelTab: {
    height: 59,
    padding: 5
  },
  button: {
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.blue.deep,
    color: colors.lightTextColor
  },
  smallLink: {
    fontSize: constants.smallText.fontSize,
    fontFamily: constants.smallText.fontFamily,
    color: colors.blue.deep
  },
  input: {
    fontFamily: 'Montserrat_regular',
    fontSize: 14,
    height: 48,
    backgroundColor: colors.inputBackground,
    padding: 8,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 4
  },
  titleHeader: {
    fontFamily: 'Montserrat_medium',
    fontSize: 14
  },
  titleText: {
    fontFamily: 'Montserrat_regular',
    fontSize: 14
  },
  markdownStyles: {
    text: {
      ...constants.regularText,
      fontSize: 13
    },
    heading: {
    },
    heading1: constants.labelText,
    heading2: {
      fontSize: 13,
      ...constants.regularText
    },
    heading3: {
      fontSize: 12,
      ...constants.regularText
    },
    heading4: constants.regularText,
    heading5: {
      fontSize: 10,
      ...constants.regularText
    },
    heading6: {
      fontSize: 9,
      ...constants.regularText
    }
  }
}

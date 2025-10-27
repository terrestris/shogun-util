import getLocalizedString from './getLocalizedString';

describe('getLocalizedString', () => {
  it('returns the input if no valid locale string is present', () => {
    expect(getLocalizedString('Input', 'de')).toEqual('Input');
    expect(getLocalizedString('$Input', 'de')).toEqual('$Input');
    expect(getLocalizedString('$$Input', 'de')).toEqual('$$Input');
    expect(getLocalizedString('$enInput', 'de')).toEqual('$enInput');
    expect(getLocalizedString('en:Input', 'de')).toEqual('en:Input');
    expect(getLocalizedString('en$:Input', 'de')).toEqual('en$:Input');
    expect(getLocalizedString('$:Input', 'de')).toEqual('$:Input');
    expect(getLocalizedString('$ :Input', 'de')).toEqual('$ :Input');
    expect(getLocalizedString('$4e:Input', 'de')).toEqual('$4e:Input');
    expect(getLocalizedString('$:Input$:Input', 'de')).toEqual('$:Input$:Input');
    expect(getLocalizedString('$🇩🇪:Input', 'de')).toEqual('$🇩🇪:Input');
  });

  it('returns the correct locale', () => {
    expect(getLocalizedString('$de:foo', 'de')).toEqual('foo');
    expect(getLocalizedString('$de:Hallo$en:Hello', 'de')).toEqual('Hallo');
    expect(getLocalizedString('$de:Hallo$en:Hello', 'en')).toEqual('Hello');
    expect(getLocalizedString('$de:Hallo Welt$en:Hello world', 'de')).toEqual('Hallo Welt');
    expect(getLocalizedString('$de:Hallo Welt$en:Hello world', 'en')).toEqual('Hello world');
    expect(getLocalizedString('$de:Hallo 🌍$en:Hello 🌍', 'de')).toEqual('Hallo 🌍');
    expect(getLocalizedString('$de:Hallo 🌍$en:Hello 🌍', 'en')).toEqual('Hello 🌍');
    expect(getLocalizedString('$de:Hallo$de:Hello', 'de')).toEqual('Hallo');
  });

  it('returns an empty string if the requested locale is not present', () => {
    expect(getLocalizedString('$de:Hallo', 'en')).toEqual('');
    expect(getLocalizedString('$en:Hello', 'de')).toEqual('');
    expect(getLocalizedString('$de:Hallo$fr:Bonjour', 'en')).toEqual('');
  });
});

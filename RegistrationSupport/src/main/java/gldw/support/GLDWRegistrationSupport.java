package gldw.support;

import vdab.api.event.VDABData;
import vdab.api.node.JavaFunctionSet_A;

public class GLDWRegistrationSupport extends JavaFunctionSet_A {

	private final static String PATH_USERNAME= ".Username";
	private final static String PATH_FIRSTNAME= ".FirstName";
	private final static String PATH_LASTNAME= ".LastName";
	private final static String PATH_ADDRESS1= ".AddressLine1";
	private final static String PATH_ADDRESS2= ".AddressLine2";
	private final static String PATH_CITY= ".City";
	private final static String PATH_STATE= ".State";
	private final static String PATH_COUNTRY= ".Country";
	private final static String PATH_POSTALCODE= ".PostalCode";
	private final static String PATH_EMAIL= ".EMail";
	private final static String PATH_PHONE = ".Phone";
	private final static String PATH_ORGANIZATION = ".Organization";
	private final static String PATH_SERVERS= ".RequestedVDABServer";
	//
	// VALIDATE  USER
	//----------------------------------------------------
	public  VDABData func_validateUserRegistration(VDABData inData, String basePath){
		
		String err = null;
		// Check Username
		String username = inData.getDataAsString(basePath+PATH_USERNAME);
		err = checkRequiredAttribute("UserName", username, 8);
		if (err != null){
			pushError(err);
			return null ;
		}


		// Check Email
		String email = inData.getDataAsString(basePath+PATH_EMAIL);
		String errInfo = validateEmail(email);
		if (errInfo != null){
			pushError(errInfo);
			return null;
		}
		
		// check Phone No
		String phone = inData.getDataAsString(basePath + PATH_PHONE);
		if (!phone.matches("\\d+") || phone.length() != 10) {
			pushError("phone number must be 10 digit number");
			return null;
		}	
		
		//Check FirstName
		String firstname = inData.getDataAsString(basePath+PATH_FIRSTNAME);
		err = checkRequiredAttribute("FirstName", firstname, 1);
		if (err != null){
			pushError(err);
			return null ;
		}



		
		String lastname = inData.getDataAsString(basePath+PATH_LASTNAME);
		err = checkRequiredAttribute("LastName", lastname, 1);
		if (err != null){
			pushError(err);
			return null ;
		}


		String address = inData.getDataAsString(basePath+PATH_ADDRESS1)+" "+inData.getDataAsString(basePath+PATH_ADDRESS2);
		err = checkRequiredAttribute("Address", address, 8 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String city = inData.getDataAsString(basePath+PATH_CITY);
		err = checkRequiredAttribute("City", city, 2 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String state = inData.getDataAsString(basePath+PATH_STATE);
		err = checkRequiredAttribute("State", state, 2 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String country = inData.getDataAsString(basePath+PATH_COUNTRY);
		err = checkRequiredAttribute("Country", country, 2 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String postalcode = inData.getDataAsString(basePath+PATH_POSTALCODE);
		err = checkRequiredAttribute("PostalCode", postalcode, 5 );
		if (err != null){
			pushError(err);
			return null ;
		}
	
		String server = inData.getDataAsString(basePath+PATH_SERVERS);
		err = checkRequiredAttribute("RequestedVDABServer", server, 2 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		return inData;
	}

// VALIDATE STREAM
//----------------------------------------------------
private final static String PATH_DATASOURCE= ".DataSource";
private final static String PATH_DATALABEL= ".DataLabel";	
private final static String PATH_DATAQUALITY= ".DataQuality";	
private final static String PATH_DATADESCRIPTION= ".DataDescription";	
private final static String PATH_GEOLOCATIONTYPE= ".GeoLocationType";
private final static String PATH_PUBLISHTO= ".PublishTo";

public  VDABData func_validateStreamRegistration(VDABData inData, String basePath){

	String err = null;
	// Check Username
	String username = inData.getDataAsString(basePath+PATH_USERNAME);
	err = checkRequiredAttribute("UserName", username, 8);
	if (err != null){
		pushError(err);
		return null ;
	}
	
	// Check DataSource
	String datasource = inData.getDataAsString(basePath+PATH_DATASOURCE);
	err = checkRequiredAttribute("DataSource", datasource, 8);
	if (err != null){
		pushError(err);
		return null ;
	}
	
	// Check DataLabel
	String datalabel = inData.getDataAsString(basePath+PATH_DATALABEL);
	err = checkRequiredAttribute("DataLabel", datalabel, 8);
	if (err != null){
		pushError(err);
		return null ;
	}

	String datadescription = inData.getDataAsString(basePath+PATH_DATADESCRIPTION);
	err = checkRequiredAttribute("DataDescription", datadescription, 24);
	if (err != null){
		pushError(err);
		return null;
	}
	
	String dataquality = inData.getDataAsString(basePath+PATH_DATAQUALITY);
	err = checkRequiredAttribute("DataQuality", dataquality, 2);
	if (err != null){
		pushError(err);
		return null;
	}
	
	String publishto = inData.getDataAsString(basePath+PATH_PUBLISHTO);
	err = checkRequiredAttribute("PublishTo", publishto, 2);
	if (err != null){
		pushError(err);
		return null;
	}
	
	String geolocationtype = inData.getDataAsString(basePath+PATH_GEOLOCATIONTYPE);
	err = checkRequiredAttribute("GeoLocationType", geolocationtype, 2);
	if (err != null){
		pushError(err);
		return null;
	}
	
	String server = inData.getDataAsString(basePath+PATH_SERVERS);
	err = checkRequiredAttribute("RequestedVDABServer", server, 2 );
	if (err != null){
		pushError(err);
		return null ;
	}
	
	return inData;
}

	//
	// VALIDATE ORGANIZATION
	//----------------------------------------------------
private final static String PATH_PRIMARYCONTACT = ".PrimaryContact";
private final static String PATH_INDUSTRY = ".Industry";	
private final static String PATH_ORGANIZATIONTYPE = ".OrganizationType";


	public  VDABData func_validateOrganizationRegistration(VDABData inData, String basePath){
		
		String err = null;
		String organization = inData.getDataAsString(basePath+PATH_ORGANIZATION);
		err = checkRequiredAttribute("Organization", organization, 8);
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String primaryContact = inData.getDataAsString(basePath+PATH_PRIMARYCONTACT);
		err = checkRequiredAttribute("PrimaryContact", primaryContact, 8);
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String industry = inData.getDataAsString(basePath+PATH_INDUSTRY);
		err = checkRequiredAttribute("Industry", industry, 2);
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String organizationType = inData.getDataAsString(basePath+PATH_ORGANIZATIONTYPE);
		err = checkRequiredAttribute("OrganizationType", organizationType, 2);
		if (err != null){
			pushError(err);
			return null ;
		}			
		
		String address = inData.getDataAsString(basePath+PATH_ADDRESS1)+" "+inData.getDataAsString(basePath+PATH_ADDRESS2);
		err = checkRequiredAttribute("Address", address, 8 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String city = inData.getDataAsString(basePath+PATH_CITY);
		err = checkRequiredAttribute("City", city, 2 );
		if (err != null){
			pushError(err);
			return null ;
		}
		

		String state = inData.getDataAsString(basePath+PATH_STATE);
		err = checkRequiredAttribute("State", state, 2 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		
		String country = inData.getDataAsString(basePath+PATH_COUNTRY);
		err = checkRequiredAttribute("Country", country, 2 );
		if (err != null){
			pushError(err);
			return null ;
		}
		
		String postalcode = inData.getDataAsString(basePath+PATH_POSTALCODE);
		err = checkRequiredAttribute("PostalCode", postalcode, 5 );
		if (err != null){
			pushError(err);
			return null ;
		}
	
		return inData;
	}

	private String validateEmail(String email){
		int pos1 = email.indexOf("@");
		int pos2 = email.indexOf(".");	
		if (pos1 < 1 || pos2 < 1)
			return "improperly formatted Email address";
		return null;
	}


}
